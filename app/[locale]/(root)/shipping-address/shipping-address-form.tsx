"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useTransition } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import LoaderIcon from "@/components/ui/loader-icon";
import { useRouter } from "@/i18n/routing";
import { updateUserAddress } from "@/lib/actions/user.actions";
import { appRoutes, shippingAddressDefaultValues } from "@/lib/constants";
import { shippingAddressSchema } from "@/lib/validators";
import { ShippingAddress } from "@/types";

const ShippingAddressForm = ({ address }: { address: ShippingAddress }) => {
  const t = useTranslations("ShippingAddress");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ShippingAddress>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues,
  });

  const onSubmit: SubmitHandler<ShippingAddress> = async (
    formData: ShippingAddress,
  ) => {
    startTransition(async () => {
      const res = await updateUserAddress(formData);

      if (!res.success) {
        toast.error(res.message);
      }

      router.push(appRoutes.PAYMENT_METHOD);
    });
  };

  return (
    <>
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="h2-bold mt-4">{t("title")}</h1>

        <p className="text-sm text-muted-foreground">{t("subTitle")}</p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-5">
            <FieldGroup>
              <Controller
                name="fullName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="fullName">
                      {t("shippingAddressForm.fullName.label")}
                    </FieldLabel>

                    <Input
                      {...field}
                      id="fullName"
                      aria-invalid={fieldState.invalid}
                      placeholder={t(
                        "shippingAddressForm.fullName.placeholder",
                      )}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="streetAddress"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="streetAddress">
                      {t("shippingAddressForm.address.label")}
                    </FieldLabel>

                    <Input
                      {...field}
                      id="streetAddress"
                      aria-invalid={fieldState.invalid}
                      placeholder={t("shippingAddressForm.address.placeholder")}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="city"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="city">
                      {t("shippingAddressForm.city.label")}
                    </FieldLabel>

                    <Input
                      {...field}
                      id="city"
                      aria-invalid={fieldState.invalid}
                      placeholder={t("shippingAddressForm.city.placeholder")}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="postalCode"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="postalCode">
                      {t("shippingAddressForm.postalCode.label")}
                    </FieldLabel>

                    <Input
                      {...field}
                      id="postalCode"
                      aria-invalid={fieldState.invalid}
                      placeholder={t(
                        "shippingAddressForm.postalCode.placeholder",
                      )}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="country"
                // disabled
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="country">
                      {t("shippingAddressForm.country.label")}
                    </FieldLabel>

                    <Input
                      {...field}
                      id="country"
                      aria-invalid={fieldState.invalid}
                      placeholder={t("shippingAddressForm.country.placeholder")}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <LoaderIcon className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              {t("shippingAddressForm.saveButton")}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ShippingAddressForm;
