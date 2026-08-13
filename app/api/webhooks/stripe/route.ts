import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { updateOrderToPaid } from "@/lib/actions/order.actions";
import { STRIPE_SECRET_KEY } from "@/lib/constants";

export async function POST(req: NextRequest) {
  //? Build the webhook event
  const event = Stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get("stripe-signature") as string,
    STRIPE_SECRET_KEY as string,
  );

  console.log("Soy el webhook menol");
  //? Check for successfull payment
  if (event.type === "charge.succeeded") {
    const { object } = event.data;

    console.log({ orderId: object.metadata.orderId });
    //? Update order status
    const res = await updateOrderToPaid({
      orderId: object.metadata.orderId,
      paymentResult: {
        id: object.id,
        status: "COMPLETED",
        email_address: object.billing_details.email!,
        pricePaid: (object.amount / 100).toFixed(),
      },
    });
    console.log("🚀 ~ POST ~ res:", res);

    return NextResponse.json({
      message: "updateOrderToPaid was successfull",
    });
  }

  return NextResponse.json({
    message: "Event is no succeeded",
  });
}
