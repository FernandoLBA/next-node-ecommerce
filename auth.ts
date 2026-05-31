import { PrismaAdapter } from "@auth/prisma-adapter";
import { compareSync } from "bcrypt-ts-edge";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { NextAuthConfig } from "next-auth";

import db from "./db/db";

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/error",
  },
  secret: process.env.NEXAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days,
  },
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          type: "email",
        },
        password: {
          type: "password",
        },
      },
      async authorize(credentials) {
        //? If there are not credentials return null
        if (credentials == null) return null;

        //? Get the user from the DB
        const user = await db.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        //? Check if user exists and if the password matches
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password,
          );

          //? If password is correct, return user
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }

        //? If users does not exist or password does not match return null
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token, trigger, user }) {
      //? Set the userId from the token (JWT sub)
      if (session.user && token.sub) {
        session.user.id = token.sub;

        //? If there is an update, set the user name
        if (trigger === "update" && user) {
          session.user.name = user.name;
        }
      }

      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
