import z from "zod";

import {
  CURRENCY,
  PAYMENT_METHODS,
  SORTING_CATEGORIES_VALUES,
  SORTING_ORDERS_VALUES,
} from "@/lib/constants";
import {
  cartItemSchema,
  insertCartSchema,
  insertOrderItemSchema,
  insertOrderSchema,
  insertProductSchema,
  insertReviewsSchema,
  paymentMethodSchema,
  paymentResultSchema,
  shippingAddressSchema,
  updateProductSchema,
  updateUserSchema,
} from "@/lib/validators";
import { JsonValue } from "@prisma/client/runtime/client";

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  numReviews: number;
  createdAt: Date;
};

export type User = z.infer<typeof updateUserSchema>;
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
  user: Omit<User, "id" | "role">;
  paymentResult: PaymentResult;
};

export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type PaymentResult = z.infer<typeof paymentResultSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;

export type Review = z.infer<typeof insertReviewsSchema> & {
  id: string;
  createdAt: Date;
  user?: { name: string };
};

export type SalesData = {
  month: string;
  totalSales: number;
}[];

export type ResponseMessage = {
  success: boolean;
  message: string;
};

export type PaymentsMethods = (typeof PAYMENT_METHODS)[number];
export type SortingProductsOptions = (typeof SORTING_ORDERS_VALUES)[number];
export type SortingCategoriesOptions =
  (typeof SORTING_CATEGORIES_VALUES)[number];

export type SearchFilters = {
  query?: string;
  category?: string;
  price?: string;
  rating?: string;
  sort?: SortingProductsOptions;
  page?: string;
};

export type FilterSearchParams = {
  searchParams: SearchFilters;
};

export type AsyncFilterSearchParams = {
  searchParams: Promise<SearchFilters>;
};

export type Locale = "es" | "en";

export type Currency = typeof CURRENCY;

//TODO: cuando se cree el modulo, se debe crear un schema para category y usarlo en vez de este tipo
export type Category = {
  id: string;
  name: string;
  image: string;
  createdAt: Date;
};

export type CategoryWithCount = {
  category: string;
  _count: number;
};

export type OrderSummary = {
  ordersCount: number;
  productsCount: number;
  categoriesCount: number;
  usersCount: number;
  totalSales: {
    _sum: {
      totalPrice: string;
    };
  };
  latestSales: Order[];
  salesData: SalesData;
};

export type AppSetting = {
  description: string | null;
  value: JsonValue;
  key: string;
  updatedAt: Date;
};
