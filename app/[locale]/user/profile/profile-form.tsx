"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import LoaderIcon from "@/components/ui/loader-icon";
import { updateProfile } from "@/lib/actions/user.actions";
import { updateUserProfileSchema } from "@/lib/validators";

const ProfileForm = () => {
  const { data: session, update } = useSession();

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
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    className="input-field"
                    aria-invalid={fieldState.invalid}
                    placeholder="example@mail.com"
                    disabled
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  {...field}
                  id="name"
                  aria-invalid={fieldState.invalid}
                  placeholder="John Doe"
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

      <Button
        type="submit"
        size="lg"
        className="button col-span-2 w-full"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? (
          <>
            <LoaderIcon />
            Submitting...
          </>
        ) : (
          "Update profile"
        )}
      </Button>
    </form>
  );
};

export default ProfileForm;
