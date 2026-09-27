"use client";

import {
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useLocale, useTranslations } from "next-intl";
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
  const t = useTranslations("Stripe");
  const locale = useLocale();
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
          //? The locale prefix is required, otherwise the locale redirect can drop the payment_intent query param
          return_url: `${APP_SERVER_URL}/${locale}/order/${orderId}/stripe-payment-success`,
        },
      })
      .then(({ error }) => {
        if (error.type === "card_error" || error.type === "validation_error") {
          setErrorMessage(error.message ?? t("genericError"));
        } else if (error) {
          setErrorMessage(t("genericError"));
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="text-xl">{t("title")}</div>
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
          ? t("purchasing")
          : t("purchase", { amount: formatCurrency(priceInCents / 100) })}
      </Button>
    </form>
  );
};

export default StripeForm;
