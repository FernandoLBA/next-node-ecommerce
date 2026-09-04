import { NextResponse } from "next/server";
import type { NextAuthConfig } from "next-auth";

import { appRoutes } from "./lib/constants";

/**
 * This file contains the base NextAuth configuration that is compatible with the Edge runtime.
 * We separate this from auth.ts to prevent Prisma/Database initialization errors when
 * using Next.js Middleware, as the Edge runtime does not support native Node.js modules
 * required by Prisma.
 */
export const authConfig = {
  providers: [], //? Providers are added in auth.ts to avoid importing bcrypt/db in the Edge runtime
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, //? 30 days
  },
  pages: {
    signIn: appRoutes.SIGN_IN,
    error: appRoutes.ERROR,
  },
  callbacks: {
    authorized({ request, auth }) {
      //? Protected routes (now using ^ anchors to avoid false positives)
      const protectedPaths = [
        /^\/shipping-address/,
        /^\/payment-method/,
        /^\/place-order/,
        /^\/profile/,
        /^\/user\/(.*)/,
        /^\/order\/(.*)/,
        /^\/admin\/(.*)/,
        /^\/admin/,
      ];

      //? Get the actual pathname
      const pathname = request.nextUrl.pathname;

      //? Remove the language prefix for comparison (e.g., /es/admin -> /admin)
      const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");

      //? Check if the route (without locale) is protected
      if (
        !auth &&
        protectedPaths.some((path) => path.test(pathnameWithoutLocale))
      ) {
        const redirectUrl = new URL(
          appRoutes.SIGN_IN,
          request.url,
        ).toString();

        return NextResponse.redirect(redirectUrl);
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
