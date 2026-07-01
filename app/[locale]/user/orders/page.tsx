import { Metadata } from "next";
import Link from "next/link";

import { getMyOrders } from "@/lib/actions/order.actions";

const metadata: Metadata = {
  title: "Orders",
  description: "Orders page",
};

const OrdersPage = async (props: {
  searchParams: Promise<{ page: string }>;
}) => {
  const { page } = await props.searchParams;

  const orders = await getMyOrders({ page: Number(page) || 1 });
  // console.log("🚀 ~ OrdersPage ~ orders:", orders);

  return <>Orders page</>;
};

export default OrdersPage;
