import { PrismaAdapter } from "@auth/prisma-adapter";
import { compareSync } from "bcrypt-ts-edge";
import NextAuth, { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { authConfig } from "./auth.config";
import db from "./db/db";

export const config = {
  ...authConfig,
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
      //* Set the userId from the token (JWT sub)
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role as string;
        session.user.name = token.name;

        //* If there is an update, set the user name
        if (trigger === "update" && user) {
          session.user.name = user.name;
        }
      }

      return session;
    },
    async jwt({ token, user }) {
      //* Assign user fields to token
      if (user) {
        token.role = (user as { role?: string }).role;

        if (user.name === "NO_NAME") {
          token.name = user.email?.split("@")[0] || "User";

          if (user.id) {
            await db.user.update({
              where: { id: user.id },
              data: { name: token.name },
            });
          }
        }
      }

      return token;
    },
    ...authConfig.callbacks,
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
