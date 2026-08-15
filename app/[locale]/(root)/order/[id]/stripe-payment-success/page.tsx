import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { sendPurchaseReceipt } from "@/email";
import { Link, redirect } from "@/i18n/routing";
import { getOrderById } from "@/lib/actions/order.actions";
import { appRoutes } from "@/lib/constants";
import { stripe } from "@/lib/stripe";
import { convertToPlainObject } from "@/lib/utils";
import { PaymentResult, ShippingAddress } from "@/types";

type SuccessPageProps = {
  params: Promise<{ id: string; locale: string }>;
  searchParams: Promise<{ payment_intent: string }>;
};

const SuccessPage = async (props: SuccessPageProps) => {
  const { id, locale } = await props.params;
  const { payment_intent } = await props.searchParams;

  //? Fetch order
  const order = await getOrderById(id);

  if (!order) notFound();

  //? Retrieve payment intent
  const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);

  //? Check if payment intent is valid
  if (
    paymentIntent.metadata.orderId == null ||
    paymentIntent.metadata.orderId !== order.id
  ) {
    return notFound();
  }

  //? Check if payment is successful
  const isSuccess = paymentIntent.status === "succeeded";

  //? Is payment is succeeded send the purchase receipt by email
  if (isSuccess) {
    sendPurchaseReceipt({
      order: {
        ...order,
        itemsPrice: order.itemsPrice.toString(),
        shippingPrice: order.shippingPrice.toString(),
        taxPrice: order.taxPrice.toString(),
        totalPrice: order.totalPrice.toString(),
        shippingAddress: convertToPlainObject(
          order.shippingAddress,
        ) as ShippingAddress,
        orderItems: order.orderItems.map((oi) => ({
          ...oi,
          price: oi.price.toString(),
        })),
        user: {
          name: order.user.name || "client name",
          email: order.user.email || "",
        },
        paymentResult: (order.paymentResult as PaymentResult) || {
          id: "",
          status: "",
          pricePaid: "",
          email_address: "",
        },
      },
    });
  } else {
    return redirect({
      href: `${appRoutes.ORDER}/${id}`,
      locale,
    });
  }

  return (
    <div className="max-w-4xl w-full mx-auto space-y-8">
      <div className="flex flex-col gap-6 items-center">
        <h1 className="h1-bold">Thanks for your purchase</h1>
        <div>We are processing your order.</div>

        <Button>
          <Link href={`${appRoutes.ORDER}/${id}`}>View Order</Link>
        </Button>
      </div>
    </div>
  );
};

export default SuccessPage;
