"use client";

import { AppButton } from "@/components/shared/app-button/app-button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import LoaderIcon from "@/components/ui/loader-icon";
import { useRouter } from "@/i18n/routing";
import { updateProfile } from "@/lib/actions/user.actions";
import { appRoutes } from "@/lib/constants";
import { updateUserProfileSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const ProfileForm = () => {
  const { data: session, update } = useSession();
  const t = useTranslations("Profile");
  const router = useRouter();

  const form = useForm<z.infer<typeof updateUserProfileSchema>>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      name: session?.user.name ?? "",
      email: session?.user.email ?? "",
    },
  });

  const onSubmit = async (values: z.infer<typeof updateUserProfileSchema>) => {
    try {
      const res = await updateProfile(values);

      if (!res.success) {
        return toast.error(res.message);
      }

      const newSession = {
        ...session,
        user: {
          ...session?.user,
          name: values.name,
        },
      };

      await update(newSession);

      toast.success(res.message);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-5">
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">
                  {t("profileForm.email")}
                </FieldLabel>

                <Input
                  {...field}
                  id="email"
                  className="input-field"
                  aria-invalid={fieldState.invalid}
                  placeholder={t("profileForm.emailPlaceholder")}
                  disabled
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">{t("profileForm.name")}</FieldLabel>

                <Input
                  {...field}
                  id="name"
                  aria-invalid={fieldState.invalid}
                  placeholder={t("profileForm.namePlaceholder")}
                  disabled={form.formState.isSubmitting}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </div>

      <div className="flex flex-col space-y-2">
        <AppButton type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <LoaderIcon />
              {t("profileForm.submitting")}
            </>
          ) : (
            <>{t("profileForm.updateProfileButton")}</>
          )}
        </AppButton>

        <AppButton
          variant="outline"
          disabled={form.formState.isSubmitting}
          onClick={() => router.push(appRoutes.HOME)}
        >
          {t("profileForm.backHome")}
        </AppButton>
      </div>
    </form>
  );
};

export default ProfileForm;
