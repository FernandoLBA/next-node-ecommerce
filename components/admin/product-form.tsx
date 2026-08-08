"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import slugify from "slugify";

import { useRouter } from "@/i18n/routing";
import { createProduct, updateProduct } from "@/lib/actions/product.actions";
import { appRoutes, productDefaultValues } from "@/lib/constants";
import { UploadButton } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { insertProductSchema, updateProductSchema } from "@/lib/validators";
import { Product } from "@/types";
import { toast } from "sonner";
import z from "zod";
import AppImage from "../ui/app-image";
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
  | z.infer<typeof insertProductSchema>
  | z.infer<typeof updateProductSchema>;

const ProductForm = ({ type, product, productId }: ProductFormProps) => {
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
        <div className="flex flex-col md:flex-row gap-5">
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
                  placeholder="Enter product name"
                  disabled={form.formState.isSubmitting}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="slug"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="slug">Slug</FieldLabel>
                <div className="flex items-center gap-2">
                  <Input
                    {...field}
                    id="slug"
                    disabled={
                      form.getValues("name").length > 0 ||
                      form.formState.isSubmitting
                    }
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter slug"
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
                    Generate
                  </Button>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          <Controller
            name="category"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="category">Category</FieldLabel>
                <Input
                  {...field}
                  id="category"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter category"
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
                <FieldLabel htmlFor="brand">Brand</FieldLabel>
                <Input
                  {...field}
                  id="brand"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter brand"
                  disabled={form.formState.isSubmitting}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          <Controller
            name="price"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="price">Price</FieldLabel>
                <Input
                  {...field}
                  id="price"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter price"
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
                <FieldLabel htmlFor="stock">Stock</FieldLabel>
                <Input
                  {...field}
                  type="number"
                  id="stock"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter stock"
                  disabled={form.formState.isSubmitting}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <div className="upload-field flex flex-col md:flex-row gap-5">
          <Controller
            name="images"
            control={form.control}
            render={({ fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="images">Images</FieldLabel>
                <Card className="relative">
                  <CardContent className="gap-2 min-h-48">
                    <div className="flex flex-wrap gap-2">
                      {images.map((image) => (
                        <AppImage
                          key={image}
                          className="w-20 h-20 object-cover object-center rounded-sm"
                          width={100}
                          height={100}
                          src={image}
                          alt="Product Image"
                        />
                      ))}

                      <UploadButton
                        className="absolute bottom-2 right-2"
                        endpoint="imageUploader"
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

        <div className="upload-field">
          <FieldLabel className="mb-3">Featured Product</FieldLabel>
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
                      <FieldLabel htmlFor="isFeatured">Is Featured?</FieldLabel>
                    </FieldContent>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {isFeatured && banner && (
                <AppImage
                  src={banner}
                  alt="banner image"
                  className="w-full object-cover object-center rounded-sm"
                  width={1920}
                  height={680}
                />
              )}

              {isFeatured && !banner && (
                <UploadButton
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

        <div>
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  {...field}
                  id="description"
                  aria-invalid={fieldState.invalid}
                  className="resize-none"
                  placeholder="Enter product description"
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
          className="button col-span-2 w-full"
        >
          {form.formState.isSubmitting ? (
            <>
              <LoaderIcon />
              Submitting...
            </>
          ) : (
            `${type} product`
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
