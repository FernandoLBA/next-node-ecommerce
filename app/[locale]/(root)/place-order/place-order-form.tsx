"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import LoaderIcon from "@/components/ui/loader-icon";
import { useRouter } from "@/i18n/routing";
import { createOrder } from "@/lib/actions/order.actions";

const PlaceOrderButton = () => {
  const t = useTranslations("PlaceOrder");
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <LoaderIcon /> : <Check className="w-4 h-4" />}{" "}
      {t("placeOrderButton")}
    </Button>
  );
};

const PlaceOrderForm = () => {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const res = await createOrder();

    if (res.redirectTo) router.push(res.redirectTo);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PlaceOrderButton />
    </form>
  );
};

export default PlaceOrderForm;
