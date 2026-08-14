// * APP CONFIG ############################################
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Store Name";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Store Description";
export const APP_SERVER_URL =
  process.env.NEXT_PUBLIC_APP_SERVER_URL || "http://localhost:3000";

// * PAGINATION CONFIG ############################################
export const PAGE_SIZE = 5;
export const ADMIN_PAGE_SIZE = 10;

// * PAYMENTS CONFIG ############################################
export const PAYMENT_METHODS = ["PayPal", "Stripe", "CashOnDelivery"] as const;
export const DEFAULT_PAYMENT_METHOD = "PayPal";
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// * PRODUCTS CONFIG ############################################
export const LATEST_PRODUCTS_LIMIT = 10;

// * LANGUAGES CONFIG ############################################
export const LANGUAGES = ["en", "es"] as const;
export const DEFAULT_LANGUAGE = "es";

// * RATING CONFIG ############################################
export const RATING_RANGES = ["all", "1", "2", "3", "4"] as const;
export const RATING_REVIEW = [1, 2, 3, 4, 5];

// * CAROUSEL CONFIG ############################################
export const CAROUSEL_DELAY = 5000;

// * APP ROUTES ############################################
export const appRoutes = {
  HOME: "/",
  IMAGES: "/images",

  ADMIN: "/admin",
  ADMIN_OVERVIEW: "/admin/overview",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_PRODUCTS_CREATE: "/admin/products/create",
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
  SEARCH: "/search",
} as const;

// * APP ROLES ############################################
export const userRoles = {
  ADMIN: "admin",
  USER: "user",
} as const;

// * DEFAULT VALUES FORM ############################################
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

export const productDefaultValues = {
  name: "",
  slug: "",
  category: "",
  images: [],
  brand: "",
  description: "",
  price: "0",
  stock: 0,
  rating: "0",
  numReviews: "0",
  isFeatured: false,
  banner: null,
};

export const reviewFormDefaultValues = {
  title: "",
  description: "",
  rating: 0,
};

// * NAVIGATION LINKS ############################################
export const navLinks = [
  {
    title: "Overview",
    href: appRoutes.ADMIN_OVERVIEW,
  },
  {
    title: "Products",
    href: appRoutes.ADMIN_PRODUCTS,
  },
  {
    title: "Orders",
    href: appRoutes.ADMIN_ORDERS,
  },
  {
    title: "Users",
    href: appRoutes.ADMIN_USERS,
  },
] as const;

// * PRICE RANGES FOR FILTERING ############################################
export const priceRanges = [
  {
    name: "All",
    value: "all",
  },
  {
    name: "$1 - $50",
    value: "1-50",
  },
  {
    name: "$51 - $100",
    value: "51-100",
  },
  {
    name: "$101 - $200",
    value: "101-200",
  },
  {
    name: "$201 - $500",
    value: "201-500",
  },
  {
    name: "$501 - $1000",
    value: "501-1000",
  },
];

// * SORTING ############################################
export const sortingOrders = {
  newest: "newest",
  highest: "highest",
  lowest: "lowest",
  rating: "rating",
};

export const SORTING_ORDERS_VALUES = Object.values(sortingOrders);

// * APP CURRENCIES ############################################
export const currencies = {
  USD: {
    symbol: "$",
    currency: "USD",
  },
  PEN: {
    symbol: "S/.",
    currency: "PEN",
  },
  EUR: {
    symbol: "€",
    currency: "EUR",
  },
} as const;

export const CURRENCIES = Object.keys(currencies);
export const CURRENCY: keyof typeof currencies = "PEN";
export const DEFAULT_CURRENCY = currencies[CURRENCY].currency;
export const DEFAULT_CURRENCY_SYMBOL = currencies[CURRENCY].symbol;

// * APP PAYMENT METHODS ############################################
export const paymentMethods = {
  paypal: PAYMENT_METHODS[0],
  stripe: PAYMENT_METHODS[1],
  cashOnDelivery: PAYMENT_METHODS[2],
};
