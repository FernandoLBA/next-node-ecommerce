"use client";

import { useRouter } from "@/i18n/routing";
import { createCategory, updateCategory } from "@/lib/actions/category.actions";
import { deleteUTFFileFromCategory } from "@/lib/actions/uploadthing.action";
import { appRoutes, categoryDefaultValues } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { insertCategorySchema, updateCategorySchema } from "@/lib/validators";
import { Category } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import {
  Controller,
  Resolver,
  SubmitHandler,
  useForm,
  useWatch,
} from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import AppUploadButton from "../shared/app-upload-button";
import AppUploadthingImage from "../shared/app-uploadthing-image";
import { AppButton } from "../shared/app-button/app-button";
import { Card, CardContent } from "../ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import LoaderIcon from "../ui/loader-icon";

type CategoryFormProps = {
  type: "Create" | "Update";
  category: Category;
  categoryId?: string | null;
};

type FormType =
  z.infer<typeof insertCategorySchema> | z.infer<typeof updateCategorySchema>;

const CategoryForm = ({ type, category, categoryId }: CategoryFormProps) => {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("AdminPages.categories.form");
  const router = useRouter();
  const schema =
    type === "Update" ? updateCategorySchema : insertCategorySchema;

  const form = useForm<FormType>({
    resolver: zodResolver(schema) as Resolver<FormType>,
    defaultValues:
      category && type === "Update" ? category : categoryDefaultValues,
  });

  const onSubmit: SubmitHandler<FormType> = async (values) => {
    if (type === "Create") {
      const res = await createCategory(values);

      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
      }

      router.push(appRoutes.ADMIN_CATEGORIES);
    }

    if (type === "Update") {
      if (!categoryId) {
        router.push(appRoutes.ADMIN_CATEGORIES);

        return;
      }

      const res = await updateCategory({ id: category.id, ...values });

      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
      }

      router.push(appRoutes.ADMIN_CATEGORIES);
    }
  };

  const handleDeleteImage = async (imageKey: string) => {
    startTransition(async () => {
      const res = await deleteUTFFileFromCategory(imageKey, category.id);

      if (!res.success) {
        toast.error(res.message);

        return;
      }

      form.setValue("image", "");
      form.setValue("key", null);

      toast.success(res.message);
    });
  };

  const image = useWatch({
    control: form.control,
    name: "image",
  });

  const key = useWatch({
    control: form.control,
    name: "key",
  });

  return (
    <form
      method="POST"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8"
    >
      <FieldGroup>
        <div className="flex flex-col gap-5">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">{t("name.label")}</FieldLabel>
                <Input
                  {...field}
                  id="name"
                  aria-invalid={fieldState.invalid}
                  placeholder={t("name.placeholder")}
                  disabled={form.formState.isSubmitting}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="upload-field flex flex-col md:flex-row gap-5">
            <Controller
              name="image"
              control={form.control}
              render={({ fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="image">{t("image.label")}</FieldLabel>

                  <Card className="relative">
                    <CardContent className="gap-2 min-h-48">
                      <div>
                        {(category.image || image) && (
                          <AppUploadthingImage
                            className="w-100 h-100"
                            imageUrl={category.image || image}
                            width={100}
                            height={100}
                            action={() => handleDeleteImage(key!)}
                            isLoading={isPending}
                          />
                        )}

                        {!category.image && !image && (
                          <AppUploadButton
                            endpoint="imageUploader"
                            className={cn("absolute bottom-2 right-2")}
                            onClientUploadComplete={(
                              res: {
                                url: string;
                                key: string;
                              }[],
                            ) => {
                              form.setValue("image", res[0].url);
                              form.setValue("key", res[0].key);
                            }}
                            onUploadError={(error: Error) => {
                              toast.error(error.message);
                            }}
                            disabled={form.formState.isSubmitting}
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Field>
              )}
            />
          </div>
        </div>
      </FieldGroup>

      <div>
        <AppButton
          type="submit"
          disabled={form.formState.isSubmitting}
          className="button col-span-2 w-full md:w-fit"
        >
          {form.formState.isSubmitting ? (
            <>
              <LoaderIcon />
              {t("submitting")}
            </>
          ) : type === "Update" ? (
            t("updateButton")
          ) : (
            t("createButton")
          )}
        </AppButton>
      </div>
    </form>
  );
};

export default CategoryForm;
