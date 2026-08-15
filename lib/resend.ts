import { Resend } from "resend";

//? Extend the global type definition to prevent multiple instances during Hot Reload in development
declare global {
  var resend: Resend | undefined;
}

//? Initialize the Resend singleton instance
export const resend =
  globalThis.resend ?? new Resend(process.env.RESEND_API_KEY as string);

//? Save the instance to the global object in non-production environments
if (process.env.NODE_ENV !== "production") {
  globalThis.resend = resend;
}
