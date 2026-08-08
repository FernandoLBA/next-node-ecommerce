"use client";

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
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...field}
                id="email"
                disabled
                aria-invalid={fieldState.invalid}
                placeholder="Enter user email"
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
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                {...field}
                id="name"
                aria-invalid={fieldState.invalid}
                placeholder="Enter user name"
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
              <FieldLabel htmlFor="role">Role</FieldLabel>
              <Select
                {...field}
                id="role"
                value={field.value.toString()}
                onValueChange={field.onChange}
                disabled={form.formState.isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Role</SelectLabel>
                    {Object.values(userRoles).map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
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
              Submitting...
            </>
          ) : (
            "Update User"
          )}
        </Button>
      </div>
    </form>
  );
};

export default UpdateUserForm;
