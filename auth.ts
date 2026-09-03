import { PrismaAdapter } from "@auth/prisma-adapter";
import { compareSync } from "bcrypt-ts-edge";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";

import { authConfig } from "./auth.config";
import prisma from "./db/db";
import { calcPrice } from "./lib/utils";
import { Cart, CartItem } from "./types";

export const config = {
  ...authConfig,
  adapter: PrismaAdapter(prisma),
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
        const user = await prisma.user.findFirst({
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
    async session({ session, token, trigger, user }: any) {
      //? Set the userId from the token (JWT sub)
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role as string;
        session.user.name = token.name;

        //? If there is an update, set the user name
        if (trigger === "update" && user) {
          session.user.name = user.name;
        }
      }

      return session;
    },
    async jwt({ token, user, trigger, session }: any) {
      //? Assign user fields to token
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;

        //*?If user has no name use the email
        if (user.name === "NO_NAME") {
          token.name = user.email?.split("@")[0];

          //? Update database to reflect the token name
          if (user.id) {
            await prisma.user.update({
              where: { id: user.id },
              data: { name: token.name },
            });
          }
        }

        //? Transfer anonymous session cart to user's account on login or registration
        if (trigger === "signIn" || trigger === "signUp") {
          //? Get session cart id from cookies
          const cookiesObject = await cookies();
          const sessionCartId = cookiesObject.get("sessionCartId")?.value;

          //? If a sessionCartId exists in cookie
          if (sessionCartId) {
            //? Gets the new cart from database by sessionCartId
            const sessionCart = await prisma.cart.findFirst({
              where: { sessionCartId },
            });

            //? Gets the previous user's cart if exists
            const previousCart = await prisma.cart.findFirst({
              where: { userId: user.id },
              orderBy: { createdAt: "desc" },
            });

            //? If a cart exists in database
            if (sessionCart) {
              const newPrices = calcPrice([
                ...(sessionCart.items as CartItem[]),
                ...(previousCart?.items as CartItem[]),
              ]);

              //? Prepare the new data to update
              const dataToUpdate = previousCart
                ? {
                    items: [...previousCart.items, ...sessionCart.items],
                    ...newPrices,
                    userId: user.id,
                  }
                : { userId: user.id };

              //? Assign new cart to the user with older data if exists
              await prisma.cart.update({
                where: { id: sessionCart.id },
                data: { ...dataToUpdate } as Cart,
              });

              //? Delete previous user cart
              if (previousCart) {
                await prisma.cart.delete({
                  where: { id: previousCart.id },
                });
              }
            }
          }
        }
      }

      //? Handle session updates
      if (session?.user.name && trigger === "update") {
        token.name = session.user.name;
      }

      return token;
    },
    ...authConfig.callbacks,
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
