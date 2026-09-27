import z from "zod";

import { PaymentsMethods } from "@/types";
import { PAYMENT_METHODS, userRoles } from "./constants";
import { formatNumberWithDecimal } from "./utils";

/**
 * Helper for currency validation
 */
const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    "validation.priceFormat",
  );

/**
 * Schema for insert products
 */
export const insertProductSchema = z.object({
  name: z
    .string()
    .min(3, "validation.nameMin")
    .max(255, "validation.nameMax"),
  slug: z.string().min(3, "validation.slugMin"),
  brand: z.string().min(3, "validation.brandMin"),
  description: z
    .string()
    .min(3, "validation.descriptionMin"),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "validation.imagesMin"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  //? The price is validated with a helper
  price: currency,
  categoryId: z.string().min(1, "validation.categoryIdRequired"),
});

/**
 * Schema for updating products extends the insert product schema and adds an id field
 */
export const updateProductSchema = insertProductSchema.extend({
  id: z.string().min(1, "validation.productIdRequired"),
});

/**
 * Schema for insert category
 */
export const insertCategorySchema = z.object({
  name: z
    .string()
    .min(3, "validation.nameMin")
    .max(255, "validation.nameMax"),
  image: z.string().min(1, "validation.imageUrlRequired"),
  key: z.string().nullish(),
});

/**
 * Schema for updating categories extends the insert category schema and adds an id field
 */
export const updateCategorySchema = insertCategorySchema.extend({
  id: z.string().min(1, "validation.categoryIdRequired"),
});

/**
 * Schema for user login
 */
export const signInFormSchema = z.object({
  email: z.email("validation.emailInvalid"),
  password: z.string().min(6, "validation.passwordMin"),
});

/**
 * Schema for user register
 */
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "validation.nameMin"),
    email: z.email("validation.emailInvalid"),
    password: z.string().min(6, "validation.passwordMin"),
    confirmPassword: z
      .string()
      .min(6, "validation.passwordMin"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "validation.passwordsDontMatch",
    path: ["confirmPassword"],
  });

/**
 * Cart schema
 */
export const cartItemSchema = z.object({
  productId: z.string().min(1, "validation.productIdRequired"),
  name: z.string().min(1, "validation.nameRequired"),
  slug: z.string().min(1, "validation.slugRequired"),
  qty: z.number().int().nonnegative("validation.qtyPositive"),
  image: z.string().min(1, "validation.imageRequired"),
  price: currency,
});

/**
 * Schema to insert items in cart
 */
export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, "validation.sessionCartIdRequired"),
  userId: z.string().optional().nullable(),
});

/**
 * Schema for the shipping address
 */
export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "validation.fullNameMin"),
  streetAddress: z
    .string()
    .min(3, "validation.addressMin"),
  city: z.string().min(3, "validation.cityMin"),
  postalCode: z
    .string()
    .min(3, "validation.postalCodeMin"),
  country: z.string().default("Peru"),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

/**
 * Schema for payment method
 */
export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, "validation.paymentMethodRequired"),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type as PaymentsMethods), {
    message: "validation.paymentMethodInvalid",
    path: ["type"],
  });

/**
 * Schema for inserting order
 */
export const insertOrderSchema = z.object({
  userId: z.string().min(1, "validation.userIdRequired"),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,
  paymentMethod: z
    .string()
    .refine((data) => PAYMENT_METHODS.includes(data as PaymentsMethods), {
      message: "validation.paymentMethodInvalid",
      // path: ["paymentMethod"],
    }),
  shippingAddress: shippingAddressSchema,
});

/**
 * Schema for inserting order item
 */
export const insertOrderItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  name: z.string(),
  image: z.string(),
  price: currency,
  qty: z.number(),
});

/**
 * Schema fot the PayPal payment result
 */
export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});

/**
 * Schema for updating the user profile
 */
export const updateUserProfileSchema = z.object({
  name: z.string().min(3, "validation.nameMin"),
  email: z.string().min(3, "validation.emailMin"),
});

/**
 * Schema for update users
 */
export const updateUserSchema = updateUserProfileSchema.extend({
  id: z.string().min(1, "validation.userIdRequired"),
  role: z
    .string()
    .min(1, "validation.roleRequired")
    .refine(
      (data) =>
        Object.values(userRoles).includes(
          data as typeof userRoles.USER | typeof userRoles.ADMIN,
        ),
      {
        message: "validation.roleInvalid",
      },
    ),
});

/**
 * Schema to insert reviews
 */
export const insertReviewsSchema = z.object({
  title: z.string().min(3, "validation.titleMin"),
  description: z.string().min(3, "validation.descriptionMin"),
  productId: z.string().min(1, "validation.productRequired"),
  userId: z.string().min(1, "validation.userRequired"),
  rating: z
    .number()
    .int()
    .min(1, "validation.ratingMin")
    .max(5, "validation.ratingMax"),
});
