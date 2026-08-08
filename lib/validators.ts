import z from "zod";

import { PaymentsMethods } from "@/types";
import { PAYMENT_METHODS, userRoles } from "./constants";
import { formatNumberWithDecimal } from "./utils";

//* Helper for currency validation
const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    "Price must be a valid number with two decimal places exactly",
  );

//* Schema for insert products
export const insertProductSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(255, "Name must be at most 255 characters long"),
  slug: z.string().min(3, "Slug must be at least 3 characters long"),
  category: z.string().min(3, "Category must be at least 3 characters long"),
  brand: z.string().min(3, "Brand must be at least 3 characters long"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters long"),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "At least one image is required"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  //? The price is validated with a helper
  price: currency,
});

//* Schema for updating products extends the insert product schema and adds an id field
export const updateProductSchema = insertProductSchema.extend({
  id: z.string().min(1, "Product ID is required"),
});

//* Schema for user login
export const signInFormSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

//* Schema for user register
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

//* Cart schemas
export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  qty: z.number().int().nonnegative("Quantity must be a positive number"),
  image: z.string().min(1, "Image is required"),
  price: currency,
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, "Session cart ID is required"),
  userId: z.string().optional().nullable(),
});

//* Schema for the shipping address
export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters long"),
  streetAddress: z
    .string()
    .min(3, "Address must be at least 3 characters long"),
  city: z.string().min(3, "Cuty must be at least 3 characters long"),
  postalCode: z
    .string()
    .min(3, "Postal code must be at least 3 characters long"),
  country: z.string().min(3, "Country must be at least 3 characters long"),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

//* Schema for payment method
export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, "Payment method type is required"),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type as PaymentsMethods), {
    message: "Invalid payment method",
    path: ["type"],
  });

//* Schema for inserting order
export const insertOrderSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,
  paymentMethod: z
    .string()
    .refine((data) => PAYMENT_METHODS.includes(data as PaymentsMethods), {
      message: "Invalid payment method",
      // path: ["paymentMethod"],
    }),
  shippingAddress: shippingAddressSchema,
});

//* Schema for inserting order item
export const insertOrderItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  name: z.string(),
  image: z.string(),
  price: currency,
  qty: z.number(),
});

//* Schema fot the PayPal payment result
export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});

//* Schema for updating the user profile
export const updateUserProfileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().min(3, "Email must be at least 3 characters long"),
});

//* Schema for update users
export const updateUserSchema = updateUserProfileSchema.extend({
  id: z.string().min(1, "User ID is required"),
  role: z
    .string()
    .min(1, "User role is required")
    .refine(
      (data) =>
        Object.values(userRoles).includes(
          data as typeof userRoles.USER | typeof userRoles.ADMIN,
        ),
      {
        message: "Invalid user role",
      },
    ),
});
