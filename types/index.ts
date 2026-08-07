import z from "zod";

import { PAYMENT_METHODS } from "@/lib/constants";
import {
  cartItemSchema,
  insertCartSchema,
  insertOrderItemSchema,
  insertOrderSchema,
  insertProductSchema,
  paymentMethodSchema,
  paymentResultSchema,
  shippingAddressSchema,
  updateProductSchema,
} from "@/lib/validators";

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  createdAt: Date;
};

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  orderItems: OrderItem[];
  user: {
    name: string;
    email: string;
  };
};
export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type PaymentResult = z.infer<typeof paymentResultSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;

export type SalesData = {
  month: string;
  totalSales: number;
}[];

export type ResponseMessage = {
  success: boolean;
  message: string;
};

export type PaymentsMethods = (typeof PAYMENT_METHODS)[number];
