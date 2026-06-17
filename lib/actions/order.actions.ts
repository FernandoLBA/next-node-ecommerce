"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";

import { auth } from "@/auth";
import db from "@/db/db";
import { CartItem } from "@/types";
import { appRoutes } from "../constants";
import { TransactionClient } from "../generated/prisma/internal/prismaNamespace";
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
      db.$transaction as unknown as <T>(
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
      redirectTo: `${appRoutes.ORDERS}/${insertedOrderId}`,
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
    const data = await db.order.findFirst({
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
