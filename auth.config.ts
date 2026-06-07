import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

/**
 * This file contains the base NextAuth configuration that is compatible with the Edge runtime.
 * We separate this from auth.ts to prevent Prisma/Database initialization errors when
 * using Next.js Middleware, as the Edge runtime does not support native Node.js modules
 * required by Prisma.
 */
export const authConfig = {
  providers: [], //* Providers are added in auth.ts to avoid importing bcrypt/db in the Edge runtime
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/sign-in",
    error: "/error",
  },
  callbacks: {
    authorized({ request, auth }) {
      //* Array of regex patterns of paths we want to protect
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/orders\/(.*)/,
        /\/admin/,
      ];

      //* Get pathname from the req URL object
      const { pathname } = request.nextUrl;

      // //* Check if user is not authenticated and accessing a protected path
      if (!auth && protectedPaths.some((path) => path.test(pathname)))
        return false;

      //* Session cart ID logic (Safe for Edge runtime)
      if (!request.cookies.get("sessionCartId")) {
        //* Generate new session cart id cookie
        const sessionCartId = crypto.randomUUID();

        //* Clone the req headers
        const newRequestHeaders = new Headers(request.headers);

        //* Create the response
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });

        //* Set newly generated sessionCartId in the response cookies
        response.cookies.set("sessionCartId", sessionCartId);

        return response;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
