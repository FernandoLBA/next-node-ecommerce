import { notFound } from "next/navigation";

import { AppLink } from "@/components/shared/app-link/app-link";
import { buttonVariants } from "@/components/ui/button";
import { sendPurchaseReceipt } from "@/email";
import { redirect } from "@/i18n/routing";
import { getOrderById } from "@/lib/actions/order.actions";
import { appRoutes } from "@/lib/constants";
import { stripe } from "@/lib/stripe";
import { cn, convertToPlainObject } from "@/lib/utils";
import { PaymentResult, ShippingAddress } from "@/types";
import AppImage from "@/components/ui/app-image";

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
    <div className="w-full h-full flex flex-col justify-center items-center gap-6">
      <AppLink href={appRoutes.HOME}>
        <AppImage alt="logo" src="/images/logo.svg" width={80} height={80} />
      </AppLink>

      <div className="flex flex-col gap-6 items-center">
        <h1 className="h1-bold">Thanks for your purchase</h1>
        <div>We are processing your order.</div>

        <AppLink
          className={cn(buttonVariants())}
          href={`${appRoutes.ORDER}/${id}`}
        >
          View Order
        </AppLink>
      </div>
    </div>
  );
};

export default SuccessPage;
