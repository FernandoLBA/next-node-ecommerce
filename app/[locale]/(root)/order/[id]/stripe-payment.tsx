"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY } from "@/lib/constants";
import { useTheme } from "next-themes";
import StripeForm from "./stripe-form";

type StripePaymentProps = {
  priceInCents: number;
  orderId: string;
  clientSecret: string;
};

const StripePayment = ({
  clientSecret,
  orderId,
  priceInCents,
}: StripePaymentProps) => {
  const { theme, systemTheme } = useTheme();
  const stripePromise = loadStripe(
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
  );

  return (
    <Elements
      options={{
        clientSecret,
        appearance: {
          theme:
            theme === "dark"
              ? "night"
              : theme === "light"
                ? "stripe"
                : systemTheme === "light"
                  ? "stripe"
                  : "night",
        },
      }}
      stripe={stripePromise}
    >
      <StripeForm priceInCents={priceInCents} orderId={orderId} />
    </Elements>
  );
};

export default StripePayment;
