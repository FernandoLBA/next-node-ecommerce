export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Store Name";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Store Description";
export const APP_SERVER_URL =
  process.env.NEXT_PUBLIC_APP_SERVER_URL || "http://localhost:3000";
export const LATEST_PRODUCTS_LIMIT = Number(
  process.env.NEXT_PUBLIC_LATEST_PRODUCTS_LIMIT || 4,
);
export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
  ? process.env.PAYMENT_METHODS.split(", ")
  : ["PayPal", "Stripe", "CashOnDelivery"];
export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD || "PayPal";
export const LANGUAGES = process.env.LANGUAGES
  ? process.env.LANGUAGES.split(", ")
  : ["en", "es"];
export const DEFAULT_LANGUAGE = process.env.DEFAULT_LANGUAGE || "es";
export const PAGE_SIZE = Number(process.env.PAGE_SIZE || 12);

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
};

export const signInDefaultValues = {
  email: "",
  password: "",
};

export const signUpDefaultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const shippingAddressDefaultValues = {
  fullName: "",
  streetAddress: "",
  city: "",
  postalCode: "",
  country: "",
};
