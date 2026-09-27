"use client";

import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import LoaderIcon from "@/components/ui/loader-icon";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "@/i18n/routing";
import { updateUser } from "@/lib/actions/user.actions";
import { appRoutes, userRoles } from "@/lib/constants";
import { updateUserSchema } from "@/lib/validators";
import { UpdateUser } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";

const UpdateUserForm = ({ user }: { user: UpdateUser }) => {
  const t = useTranslations("AdminPages.users");
  const router = useRouter();

  const form = useForm<UpdateUser>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: user as UpdateUser,
  });

  const onSubmit = async (values: UpdateUser) => {
    try {
      const res = await updateUser({ ...values, id: user.id });

      if (!res.success) {
        toast.error(res.message);
      }

      toast.success(res.message);
      form.reset();
      router.push(appRoutes.ADMIN_USERS);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <form
      className="flex flex-col gap-5"
      method="POST"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      {/* EMAIL */}
      <div>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">{t("updateForm.email.label")}</FieldLabel>
              <Input
                {...field}
                id="email"
                disabled
                aria-invalid={fieldState.invalid}
                placeholder={t("updateForm.email.placeholder")}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      {/* NAME */}
      <div>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">{t("updateForm.name.label")}</FieldLabel>
              <Input
                {...field}
                id="name"
                aria-invalid={fieldState.invalid}
                placeholder={t("updateForm.name.placeholder")}
                disabled={form.formState.isSubmitting}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      {/* ROLE */}
      <div>
        <Controller
          name="role"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="role">{t("updateForm.role.label")}</FieldLabel>
              <Select
                {...field}
                id="role"
                value={field.value.toString()}
                onValueChange={field.onChange}
                disabled={form.formState.isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("updateForm.role.placeholder")} />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t("updateForm.role.label")}</SelectLabel>
                    {Object.values(userRoles).map((role) => (
                      <SelectItem key={role} value={role}>
                        {t(`roles.${role}`)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <div className="flex-between">
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <LoaderIcon />
              {t("updateForm.submitting")}
            </>
          ) : (
            t("updateForm.submitButton")
          )}
        </Button>
      </div>
    </form>
  );
};

export default UpdateUserForm;
