"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import slugify from "slugify";
import { toast } from "sonner";
import z from "zod";

import { useRouter } from "@/i18n/routing";
import { createProduct, updateProduct } from "@/lib/actions/product.actions";
import {
  deleteBannerUTFFileFromProducts,
  deleteUTFFileFromProducts,
} from "@/lib/actions/uploadthing.action";
import { appRoutes, productDefaultValues } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { insertProductSchema, updateProductSchema } from "@/lib/validators";
import { Product } from "@/types";
import { useTransition } from "react";
import AppUploadButton from "../shared/app-upload-button";
import AppUploadthingImage from "../shared/app-uploadthing-image";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";
import LoaderIcon from "../ui/loader-icon";
import { Textarea } from "../ui/textarea";

type ProductFormProps = {
  type: "Create" | "Update";
  product: Product;
  productId?: string;
};

type FormType =
  z.infer<typeof insertProductSchema> | z.infer<typeof updateProductSchema>;

const ProductForm = ({ type, product, productId }: ProductFormProps) => {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("AdminPages");
  const router = useRouter();
  const schema = type === "Update" ? updateProductSchema : insertProductSchema;

  const form = useForm<FormType>({
    //? zodResolver has a concrete schema type which can be incompatible with
    //? the union FormType. Cast schema to any to satisfy the Resolver generic.
    // eslint-disable-next-line
    resolver: zodResolver(schema) as any,
    defaultValues:
      product && type === "Update" ? product : productDefaultValues,
  });

  const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (
    values,
  ) => {
    if (type === "Create") {
      const res = await createProduct(values);

      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
      }

      router.push(appRoutes.ADMIN_PRODUCTS);
    }

    if (type === "Update") {
      if (!productId) {
        router.push(appRoutes.ADMIN_PRODUCTS);

        return;
      }

      const res = await updateProduct({ id: productId, ...values });

      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
      }

      router.push(appRoutes.ADMIN_PRODUCTS);
    }
  };

  const handleDeleteImage = async (
    imageUrl: string,
    source: "imageProduct" | "banner" = "imageProduct",
  ) => {
    startTransition(async () => {
      if (source === "imageProduct") {
        const res = await deleteUTFFileFromProducts({
          imageUrl,
          productId: productId as string,
        });

        if (!res.success) {
          toast.error(res.message);
          return;
        }

        const currentFormImages: string[] = form.getValues("images");
        const updatedFormImages = currentFormImages.filter(
          (img) => img !== imageUrl,
        );

        form.setValue("images", updatedFormImages, { shouldValidate: true });
        toast.success(res.message);
      } else {
        const res = await deleteBannerUTFFileFromProducts({
          imageUrl,
          productId: productId as string,
        });

        if (!res.success) {
          toast.error(res.message);
          return;
        }

        form.setValue("banner", "", { shouldValidate: true });
        toast.success(res.message);
      }
    });
  };

  const images = useWatch({
    control: form.control,
    name: "images",
  });
  const isFeatured = useWatch({
    control: form.control,
    name: "isFeatured",
  });
  const banner = useWatch({
    control: form.control,
    name: "banner",
  });

  return (
    <form
      method="POST"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8"
    >
      <FieldGroup>
        {/* //* NAME */}
        <div className="flex flex-col md:flex-row gap-5">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">
                  {t("products.createProductForm.name.label")}
                </FieldLabel>
                <Input
                  {...field}
                  id="name"
                  aria-invalid={fieldState.invalid}
                  placeholder={t("products.createProductForm.name.placeholder")}
                  disabled={form.formState.isSubmitting}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* //* SLUG */}
          <Controller
            name="slug"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="slug">
                  {t("products.createProductForm.slug.label")}
                </FieldLabel>
                <div className="flex items-center gap-2">
                  <Input
                    {...field}
                    id="slug"
                    disabled={
                      form.getValues("name").length > 0 ||
                      form.formState.isSubmitting
                    }
                    aria-invalid={fieldState.invalid}
                    placeholder={t(
                      "products.createProductForm.slug.placeholder",
                    )}
                  />
                  <Button
                    type="button"
                    className="px-4 py-1"
                    disabled={form.formState.isSubmitting}
                    onClick={() =>
                      form.setValue(
                        "slug",
                        slugify(form.getValues("name"), {
                          lower: true,
                        }),
                      )
                    }
                  >
                    {t("products.createProductForm.slug.generateSlugButton")}
                  </Button>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        {/* //* CATEGORY */}
        <div className="flex flex-col md:flex-row gap-5">
          <Controller
            name="category"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="category">
                  {t("products.createProductForm.category.label")}
                </FieldLabel>
                <Input
                  {...field}
                  id="category"
                  aria-invalid={fieldState.invalid}
                  placeholder={t(
                    "products.createProductForm.category.placeholder",
                  )}
                  disabled={form.formState.isSubmitting}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="brand"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="brand">
                  {t("products.createProductForm.brand.label")}
                </FieldLabel>
                <Input
                  {...field}
                  id="brand"
                  aria-invalid={fieldState.invalid}
                  placeholder={t(
                    "products.createProductForm.brand.placeholder",
                  )}
                  disabled={form.formState.isSubmitting}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        {/* //* PRICE */}
        <div className="flex flex-col md:flex-row gap-5">
          <Controller
            name="price"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="price">
                  {t("products.createProductForm.price.label")}
                </FieldLabel>
                <Input
                  {...field}
                  id="price"
                  aria-invalid={fieldState.invalid}
                  placeholder={t(
                    "products.createProductForm.price.placeholder",
                  )}
                  disabled={form.formState.isSubmitting}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="stock"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="stock">
                  {t("products.createProductForm.stock.label")}
                </FieldLabel>
                <Input
                  {...field}
                  type="number"
                  id="stock"
                  aria-invalid={fieldState.invalid}
                  placeholder={t(
                    "products.createProductForm.stock.placeholder",
                  )}
                  disabled={form.formState.isSubmitting}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        {/* //* PRODUCT IMAGES */}
        <div className="upload-field flex flex-col md:flex-row gap-5">
          <Controller
            name="images"
            control={form.control}
            render={({ fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="images">
                  {t("products.createProductForm.images.label")}
                </FieldLabel>

                <Card className="relative">
                  <CardContent className="gap-2 min-h-48">
                    <div className="flex flex-wrap gap-2">
                      {images.map((image) => (
                        <AppUploadthingImage
                          key={image}
                          className="w-20 h-20"
                          imageUrl={image}
                          width={100}
                          height={100}
                          action={() => handleDeleteImage(image)}
                          isLoading={isPending}
                        />
                      ))}

                      <AppUploadButton
                        endpoint="imageUploader"
                        className="absolute bottom-2 right-2"
                        onClientUploadComplete={(res: { url: string }[]) => {
                          form.setValue("images", [...images, res[0].url]);
                        }}
                        onUploadError={(error: Error) => {
                          toast.error(error.message);
                        }}
                        disabled={form.formState.isSubmitting}
                      />
                    </div>
                  </CardContent>
                </Card>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        {/* //* FEATURED PRODUCT BANNER */}
        <div className="upload-field">
          <FieldLabel className="mb-3">
            {t("products.createProductForm.featuredProduct.label")}
          </FieldLabel>

          <Card
            className={cn("relative", `${isFeatured && !banner && "h-30"}`)}
          >
            <CardContent className="space-y-2">
              <Controller
                name="isFeatured"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    orientation="horizontal"
                    data-invalid={fieldState.invalid}
                  >
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="isFeatured"
                      aria-invalid={fieldState.invalid}
                      className="resize-none"
                      disabled={form.formState.isSubmitting}
                    />

                    <FieldContent>
                      <FieldLabel htmlFor="isFeatured">
                        {t(
                          "products.createProductForm.featuredProduct.checkboxLabel",
                        )}
                      </FieldLabel>
                    </FieldContent>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {isFeatured && banner && (
                <AppUploadthingImage
                  className="w-full"
                  imageUrl={banner}
                  height={680}
                  width={1920}
                  isLoading={isPending}
                  action={() => handleDeleteImage(banner, "banner")}
                />
                // <div className="relative">
                //   <AppImage
                //     src={banner}
                //     alt="banner image"
                //     className="w-full rounded-sm"
                //     width={1920}
                //     height={680}
                //   />

                //   <Button
                //     className="absolute rounded-full h-6 w-6 -top-3 -right-3"
                //     onClick={() => handleDeleteImage(banner)}
                //     disabled={isPending}
                //   >
                //     <X />
                //   </Button>
                // </div>
              )}

              {isFeatured && !banner && (
                <AppUploadButton
                  className="absolute bottom-2 right-2"
                  endpoint="imageUploader"
                  onClientUploadComplete={(res: { url: string }[]) => {
                    form.setValue("banner", res[0].url);
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(error.message);
                  }}
                  disabled={form.formState.isSubmitting}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* //* DESCRIPTION */}
        <div>
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="description">
                  {t("products.createProductForm.description.label")}
                </FieldLabel>

                <Textarea
                  {...field}
                  id="description"
                  aria-invalid={fieldState.invalid}
                  className="resize-none"
                  placeholder={t(
                    "products.createProductForm.description.placeholder",
                  )}
                  disabled={form.formState.isSubmitting}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </FieldGroup>

      <div>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="button col-span-2 w-full md:w-fit"
        >
          {form.formState.isSubmitting ? (
            <>
              <LoaderIcon />
              {t("products.createProductForm.submittingText")}
            </>
          ) : type === "Update" ? (
            t("products.createProductForm.updateProductButton")
          ) : (
            t("products.createProductForm.createProductButton")
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
