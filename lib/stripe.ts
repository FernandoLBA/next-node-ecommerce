import Stripe from "stripe";

import { STRIPE_SECRET_KEY } from "./constants";

//? Extend the global type definition to prevent multiple instances during Hot Reload in development
declare global {
  var stripe: Stripe | undefined;
}

//? Initialize the Stripe singleton instance
export const stripe =
  globalThis.stripe ??
  new Stripe(STRIPE_SECRET_KEY as string, 
  //   {
  //   apiVersion: "2026-07-29.dahlia",
  //   typescript: true,
  // }
);

//? Save the instance to the global object in non-production environments
if (process.env.NODE_ENV !== "production") {
  globalThis.stripe = stripe;
}
