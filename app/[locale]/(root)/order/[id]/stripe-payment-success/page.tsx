import { notFound } from "next/navigation";
import Stripe from "stripe";

import { getOrderById } from "@/lib/actions/order.actions";
import { appRoutes, STRIPE_SECRET_KEY } from "@/lib/constants";
import { Link, redirect } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

const stripe = new Stripe(STRIPE_SECRET_KEY as string);

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

  if (!isSuccess)
    return redirect({
      href: `${appRoutes.ORDER}/${id}`,
      locale,
    });

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
