export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Store Name";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Store Description";
export const APP_SERVER_URL =
  process.env.NEXT_PUBLIC_APP_SERVER_URL || "http://localhost:3000";
export const LATEST_PRODUCTS_LIMIT = 10;
export const PAYMENT_METHODS = ["PayPal", "Stripe", "CashOnDelivery"] as const;
export const DEFAULT_PAYMENT_METHOD = "PayPal";
export const LANGUAGES = ["en", "es"] as const;
export const DEFAULT_LANGUAGE = "es";
export const PAGE_SIZE = 5;

export const appRoutes = {
  HOME: "/",

  ADMIN: "/admin",
  ADMIN_OVERVIEW: "/admin/overview",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_USERS: "/admin/users",

  USER: "/user",
  USER_PROFILE: "/user/profile",
  USER_ORDERS: "/user/orders",

  PROFILE: "/profile",

  PRODUCTS: "/products",
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDER: "/order",

  SHIPPING_ADDRESS: "/shipping-address",
  PAYMENT_METHOD: "/payment-method",
  PLACE_ORDER: "/place-order",

  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",

  FORGOT_PASSWORD: "/forgot-password",

  ERROR: "/error",
} as const;

export const userRoles = {
  ADMIN: "admin",
  USER: "user",
} as const;

export const signInDefaultValues = {
  email: "",
  password: "",
} as const;

export const signUpDefaultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
} as const;

export const shippingAddressDefaultValues = {
  fullName: "",
  streetAddress: "",
  city: "",
  postalCode: "",
  country: "",
} as const;
