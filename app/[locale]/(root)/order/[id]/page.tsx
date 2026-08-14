import { Metadata } from "next";
import { notFound } from "next/navigation";
import Stripe from "stripe";

import { auth } from "@/auth";
import { getOrderById } from "@/lib/actions/order.actions";
import {
  DEFAULT_CURRENCY,
  paymentMethods,
  STRIPE_SECRET_KEY,
  userRoles,
} from "@/lib/constants";
import type { Order, ShippingAddress } from "@/types";
import OrderDetailsTable from "./order-details-table";

export const metada: Metadata = {
  title: "Order Details",
};

const OrderDetailsPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;
  const session = await auth();
  let client_secret = null;

  const order = await getOrderById(id);

  if (!order) notFound();

  //? Handle API error shape: { success: boolean; message: string }
  if ("success" in order) notFound();

  //? Parse every item price to string
  const orderItems = order.orderItems.map((item) => ({
    ...item,
    price: item.price.toString(),
  }));

  //? Formats the entire Order object
  const formattedOrder: Order = {
    ...order,
    orderItems,
    itemsPrice: order.itemsPrice.toString(),
    shippingPrice: order.shippingPrice.toString(),
    taxPrice: order.taxPrice.toString(),
    totalPrice: order.totalPrice.toString(),
    shippingAddress: order.shippingAddress as ShippingAddress,
    user: {
      name: order.user.name as string,
      email: order.user.email,
    },
  };

  //? Check if is not paid and using stripe
  if (order.paymentMethod === paymentMethods.stripe && !order.isPaid) {
    //? Init stripe instance
    const stripe = new Stripe(STRIPE_SECRET_KEY as string);

    //? Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: DEFAULT_CURRENCY,
      metadata: { orderId: order.id },
      automatic_payment_methods: { enabled: true },
    });
    client_secret = paymentIntent.client_secret;
  }

  return (
    <OrderDetailsTable
      order={formattedOrder}
      stripeClientSecret={client_secret}
      payPalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
      isAdmin={session?.user.role === userRoles.ADMIN || false}
    />
  );
};

export default OrderDetailsPage;
