"use server";

import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";

import { auth } from "@/auth";
import prisma from "@/db/db";
import { sendPurchaseReceipt } from "@/email";
import { CartItem, PaymentResult, SalesData, ShippingAddress } from "@/types";
import { appRoutes, PAGE_SIZE } from "../constants";
import { Prisma } from "../generated/prisma/client";
import { TransactionClient } from "../generated/prisma/internal/prismaNamespace";
import { paypal } from "../paypal";
import { convertToPlainObject, formatError } from "../utils";
import { insertOrderSchema } from "../validators";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";

/**
 * Create order and create the order items
 *
 * @returns
 */
export async function createOrder() {
  try {
    const session = await auth();

    if (!session) throw new Error("User not authenticated");

    const cart = await getMyCart();
    const userId = session.user.id;

    if (!userId) throw new Error("User not found");

    const user = await getUserById(userId);

    if (!user) throw new Error("User not found");

    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: "Cart is empty",
        redirectTo: appRoutes.CART,
      };
    }

    if (!user.address) {
      return {
        success: false,
        message: "No shipping address found",
        redirectTo: appRoutes.SHIPPING_ADDRESS,
      };
    }

    if (!user.paymentMethod) {
      return {
        success: false,
        message: "No payment method",
        redirectTo: appRoutes.PAYMENT_METHOD,
      };
    }

    //* Create order object
    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });

    //* Create a transaction to create order and order items in database
    const insertedOrderId = await (
      prisma.$transaction as unknown as <T>(
        arg: (tx: TransactionClient) => Promise<T>,
      ) => Promise<T>
    )(async (tx) => {
      //* Create order
      const insertedOrder = await tx.order.create({ data: order });

      //* Create order items from the cart items
      await tx.orderItem.createMany({
        data: (cart.items as CartItem[]).map((item) => ({
          ...item,
          orderId: insertedOrder.id,
          price: item.price,
        })),
      });

      //* Clear the cart
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          itemsPrice: 0,
          shippingPrice: 0,
          taxPrice: 0,
          totalPrice: 0,
        },
      });

      return insertedOrder.id;
    });

    if (!insertedOrderId) throw new Error("Order not created");

    return {
      success: true,
      message: "Order created successfully",
      redirectTo: `${appRoutes.ORDER}/${insertedOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;

    return {
      success: false,
      message: formatError(error),
    };
  }
}

/**
 * get order by id
 *
 * @param orderId
 * @returns
 */
export async function getOrderById(orderId: string) {
  // try {
  const data = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      orderItems: true,
      user: { select: { name: true, email: true } },
    },
  });

  return convertToPlainObject(data);
  // } catch (error) {
  //   if (isRedirectError(error)) throw error;

  //   return {
  //     success: false,
  //     message: formatError(error),
  //   };
  // }
}

/**
 * Create new paypal order
 *
 * @param orderId
 * @returns
 */
export async function createPayPalOrder(orderId: string) {
  try {
    //* Get order from database
    const order = await prisma.order.findFirst({
      where: { id: orderId },
    });

    if (order) {
      //* Create paypal order
      const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

      //* Update order with paypal order Id
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentResult: {
            id: paypalOrder.id,
            email_address: "",
            status: "",
            pricePaid: 0,
          },
        },
      });

      return {
        success: true,
        message: "Item order created succesfully",
        data: paypalOrder.id,
      };
    } else {
      throw new Error("Order not found");
    }
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

/**
 * Approve paypal order and update order to paid
 *
 * @param orderId
 * @param data
 * @returns
 */
export async function approvePayPalOrder(
  orderId: string,
  data: { orderID: string },
) {
  try {
    //* Get order from database
    const order = await prisma.order.findFirst({
      where: { id: orderId },
    });

    if (!order) throw new Error("Order not found");

    const captureData = await paypal.capturePayment(data.orderID);

    if (
      !captureData ||
      captureData.id !== (order.paymentResult as PaymentResult)?.id ||
      captureData.status !== "COMPLETED"
    ) {
      throw new Error("Error in paypal payment");
    }

    // * Update order to paid
    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: captureData.id,
        status: captureData.status,
        email_address: captureData.payer.email_address,
        pricePaid:
          captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
      },
    });

    revalidatePath(`${appRoutes.ORDER}/${orderId}`);

    return {
      success: true,
      message: "Your order has been paid",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

/**
 * Update order to paid
 *
 * @param param0
 */
export async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult?: PaymentResult;
}) {
  try {
    //? Get order from database
    const order = await prisma.order.findFirst({
      where: { id: orderId },
      include: {
        orderItems: true,
      },
    });

    if (!order) throw new Error("Order not found");

    if (order.isPaid)
      return { success: true, message: "Order is already paid" };

    //? Transaction to update order and account for product stock
    await (
      prisma.$transaction as unknown as <T>(
        arg: (tx: TransactionClient) => Promise<T>,
      ) => Promise<T>
    )(async (tx) => {
      // ? Iterate over products and update stock
      for (const item of order.orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: -item.qty } },
        });
      }

      //? Converts paymentResult to a plain object to avoid issues with prisma JSON
      const cleanPaymentResult = paymentResult
        ? (convertToPlainObject(paymentResult) as Prisma.InputJsonValue)
        : Prisma.JsonNull;

      // ? Set the order to paid
      await tx.order.update({
        where: { id: orderId },
        data: {
          isPaid: true,
          paidAt: new Date(),
          paymentResult: cleanPaymentResult,
        },
      });
    });

    // ? Get updated order after transaction
    const updatedOrder = await prisma.order.findFirst({
      where: { id: orderId },
      include: {
        orderItems: true,
        user: { select: { name: true, email: true } },
      },
    });

    if (!updatedOrder) throw new Error("Order not found");

    //? Formats and sanitize the order object before send with resend/react-email to ensure default values id any of them is null
    const formattedOrder = {
      ...updatedOrder,
      shippingAddress: (updatedOrder.shippingAddress as ShippingAddress) || {},
      paymentResult: (updatedOrder.paymentResult as PaymentResult) || {
        id: "",
        status: "",
        pricePaid: "",
        email_address: "",
      },
      itemsPrice: updatedOrder.itemsPrice.toString(),
      shippingPrice: updatedOrder.shippingPrice.toString(),
      taxPrice: updatedOrder.taxPrice.toString(),
      totalPrice: updatedOrder.totalPrice.toString(),
      orderItems: updatedOrder.orderItems.map((oi) => ({
        ...oi,
        name: (oi.name || "Product").toString(),
        price: oi.price.toString(),
      })),
      user: {
        ...updatedOrder.user,
        name: (updatedOrder.user.name || "client name").toString(),
        email: updatedOrder.user.email || "",
      },
    };

    try {
      await sendPurchaseReceipt({ order: formattedOrder });
    } catch (emailError) {
      return {
        success: false,
        message: formatError(emailError),
      };
    }

    return {
      success: true,
      message: "Order was successfully paid",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

/**
 * Get user's orders
 *
 * @param param0
 * @returns
 */
export async function getMyOrders({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const session = await auth();

  if (!session) throw new Error("User not authenticated");

  const data = await prisma.order.findMany({
    where: { userId: session?.user.id },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.order.count({
    where: { userId: session?.user.id },
  });

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

/**
 * get sales data and order summary for admin dashboard
 *
 * @returns
 */
export async function getOrderSummary() {
  //* Get counts for each resource
  const ordersCount = await prisma.order.count();
  const productsCount = await prisma.product.count();
  const usersCount = await prisma.user.count();

  //* Calculate the total sales and total orders
  const totalSales = await prisma.order.aggregate({
    _sum: {
      totalPrice: true,
    },
  });

  //* Get monthly sales
  const salesDataRaw = await prisma.$queryRaw<
    Array<{ month: string; totalSales: Prisma.Decimal }>
  >`
    SELECT 
      to_char("createdAt", 'MM/YYYY') as "month", 
      SUM("totalPrice") as "totalSales" 
    FROM "Order" 
      GROUP BY to_char("createdAt", 'MM/YYYY')
    ORDER BY
      to_char("createdAt", 'MM/YYYY') ASC
      `;

  const salesData: SalesData = salesDataRaw.map((entry) => ({
    month: entry.month,
    totalSales: Number(entry.totalSales),
  }));

  //* Get latest sales
  const latestSales = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true } },
    },
    take: 6,
  });

  return {
    ordersCount,
    productsCount,
    usersCount,
    totalSales,
    latestSales,
    salesData,
  };
}

/**
 * Get all orders for admin
 *
 * @param param0
 * @returns
 */
export async function getAllOrders({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}) {
  const matchCondition: Prisma.OrderWhereInput =
    query && query !== "all"
      ? {
          user: {
            name: {
              contains: query,
              mode: "insensitive",
            } as Prisma.StringFilter,
          },
        }
      : {};

  const [data, count] = await prisma.$transaction([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: (page - 1) * limit,
      include: {
        user: { select: { name: true } },
      },
      where: {
        ...matchCondition,
      },
    }),
    prisma.order.count({
      where: {
        ...matchCondition,
      },
    }),
  ]);

  return {
    data,
    totalPages: Math.ceil(count / limit),
  };
}

/**
 * Delete an order by id
 *
 * @param id
 * @returns
 */
export async function deleteOrderById(id: string) {
  try {
    await prisma.order.delete({ where: { id } });

    revalidatePath(appRoutes.ADMIN_ORDERS);

    return {
      success: true,
      message: "Order deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

/**
 * update COD order as delivered
 *
 * @param orderId
 * @returns
 */
export async function updateOrderToDeliveredCOD(orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId },
    });

    if (!order) throw new Error("Order not found");

    if (order.isDelivered) throw new Error("Order is already delivered");

    if (!order.isPaid) throw new Error("Order is not paid yet");

    await prisma.order.update({
      where: { id: orderId },
      data: {
        isDelivered: true,
        deliveredAt: new Date(),
      },
    });

    revalidatePath(`${appRoutes.ORDER}/${orderId}`);

    return {
      success: true,
      message: "Order marked as delivered",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

/**
 * Update COD order as paid
 *
 * @param orderId
 * @returns
 */
export async function updateOrderToPaidCOD(orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId },
    });

    if (!order) throw new Error("Order not found");

    if (order.isPaid) throw new Error("Order is already paid");

    await prisma.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
      },
    });

    revalidatePath(`${appRoutes.ORDER}/${orderId}`);

    return {
      success: true,
      message: "Order marked as paid",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
