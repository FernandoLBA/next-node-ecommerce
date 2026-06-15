"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import LoaderIcon from "@/components/ui/loader-icon";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { updateUserPaymentMethod } from "@/lib/actions/user.actions";
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants";
import { PaymentMethod } from "@/types";
import { toast } from "sonner";

const PaymentMethodForm = ({
  preferredPaymentMethod,
}: {
  preferredPaymentMethod: string | null;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<PaymentMethod>({
    defaultValues: {
      type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
    },
  });

  const onSubmit = async (formData: PaymentMethod) => {
    startTransition(async () => {
      const res = await updateUserPaymentMethod(formData);

      if (!res.success) {
        toast.error(res.message);

        return;
      }

      router.push("/place-order");
    });
  };

  return (
    <>
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="h2-bold mt-4">Payment Method</h1>
        <p className="text-sm text-muted-foreground">
          Please select a payment method
        </p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-5">
            <Controller
              name="type"
              control={form.control}
              render={({ field }) => (
                <RadioGroup
                  {...field} //* it has the field.onChange method implicit
                  className="w-fit"
                >
                  {PAYMENT_METHODS.map((paymentMethod) => (
                    <div
                      key={paymentMethod}
                      className="flex items-center gap-2"
                    >
                      <RadioGroupItem
                        id={paymentMethod}
                        value={paymentMethod}
                      />
                      <Label htmlFor={paymentMethod} className="font-normal">
                        {paymentMethod === "CashOnDelivery"
                          ? "Cash on Delivery"
                          : paymentMethod}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <LoaderIcon className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              Save
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PaymentMethodForm;
