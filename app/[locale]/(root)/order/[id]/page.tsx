import { Metadata } from "next";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { getOrderById } from "@/lib/actions/order.actions";
import { userRoles } from "@/lib/constants";
import type { Order, ShippingAddress } from "@/types";
import OrderDetailsTable from "./order-details-table";

export const metada: Metadata = {
  title: "Order Details",
};

const OrderDetailsPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;
  const session = await auth();

  const order = await getOrderById(id);

  if (!order) notFound();

  //* Handle API error shape: { success: boolean; message: string }
  if ("success" in order) notFound();

  //* Parse every item price to string
  const orderItems = order.orderItems.map((item) => ({
    ...item,
    price: item.price.toString(),
  }));

  //* Formats the entire Order object
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

  return (
    <OrderDetailsTable
      order={formattedOrder}
      payPalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
      isAdmin={session?.user.role === userRoles.ADMIN || false}
    />
  );
};

export default OrderDetailsPage;
