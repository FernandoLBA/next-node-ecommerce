"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import slugify from "slugify";

import { useRouter } from "@/i18n/routing";
import { createProduct, updateProduct } from "@/lib/actions/product.actions";
import { appRoutes, productDefaultValues } from "@/lib/constants";
import { insertProductSchema, updateProductSchema } from "@/lib/validators";
import { Product } from "@/types";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
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
                    disabled={form.getValues("name").length > 0}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter slug"
                  />
                  <Button
                    type="button"
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1"
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
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <div className="upload-field flex flex-col md:flex-row gap-5">
          {/* images */}
        </div>

        <div className="upload-field">{/* isFeatured */}</div>

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
          {form.formState.isSubmitting ? "Submitting..." : `${type} product`}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
