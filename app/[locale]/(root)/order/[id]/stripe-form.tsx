"use client";

import {
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { ChangeEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { APP_SERVER_URL } from "@/lib/constants";

const StripeForm = ({
  priceInCents,
  orderId,
}: {
  priceInCents: number;
  orderId: string;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: ChangeEvent) => {
    e.preventDefault();

    if (stripe === null || elements === null || email === null) return;

    setIsLoading(true);

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${APP_SERVER_URL}/order/${orderId}/stripe-payment-success`,
        },
      })
      .then(({ error }) => {
        if (error.type === "card_error" || error.type === "validation_error") {
          setErrorMessage(error.message ?? "An error occurred");
        } else if (error) {
          setErrorMessage("An error occurred");
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="text-xl">Stripe Checkout</div>
      {errorMessage && <div className="text-destructive">{errorMessage}</div>}

      <PaymentElement
        options={{
          layout: {
            type: "tabs",
            defaultCollapsed: false,
          },
        }}
      />

      <div>
        <LinkAuthenticationElement onChange={(e) => setEmail(e.value.email)} />
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={stripe == null || elements == null || isLoading}
      >
        {isLoading
          ? "Purchasing..."
          : `Purchase ${formatCurrency(priceInCents / 100)}`}
      </Button>
    </form>
  );
};

export default StripeForm;
