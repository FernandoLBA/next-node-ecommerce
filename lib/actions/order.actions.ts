"use server";

import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";

import { auth } from "@/auth";
import prisma from "@/db/db";
import { CartItem, PaymentResult } from "@/types";
import { appRoutes, PAGE_SIZE } from "../constants";
import { TransactionClient } from "../generated/prisma/internal/prismaNamespace";
import { paypal } from "../paypal";
import { convertToPlainObject, formatError } from "../utils";
import { insertOrderSchema } from "../validators";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";

//* Create order and create the order items

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
      message: await formatError(error),
    };
  }
}

//* get order by id
export async function getOrderById(orderId: string) {
  try {
    const data = await prisma.order.findFirst({
      where: { id: orderId },
      include: {
        orderItems: true,
        user: { select: { name: true, email: true } },
      },
    });

    return convertToPlainObject(data);
  } catch (error) {
    if (isRedirectError(error)) throw error;

    return {
      success: false,
      message: await formatError(error),
    };
  }
}

//* Create new paypal order
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

//* Approve paypal order and update order to paid
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

//* Update order to paid
export async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult?: PaymentResult;
}) {
  //* Get order from database
  const order = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      orderItems: true,
    },
  });

  if (!order) throw new Error("Order not found");

  if (order.isPaid) throw new Error("Order is already paid");

  // * Transaction to update order and account for product stock
  await (
    prisma.$transaction as unknown as <T>(
      arg: (tx: TransactionClient) => Promise<T>,
    ) => Promise<T>
  )(async (tx) => {
    // * Iterate over products and update stock
    for (const item of order.orderItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: -item.qty } },
      });
    }

    // * Set the order to paid
    await tx.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
      },
    });
  });

  // * Get updated order after transaction
  const updatedOrder = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      orderItems: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!updatedOrder) throw new Error("Order not found");
}

// * Get user's orders
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
