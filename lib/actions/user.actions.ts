"use server";

import { hashSync } from "bcrypt-ts-edge";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import z from "zod";

import { auth, signIn, signOut } from "@/auth";
import prisma from "@/db/db";
import { ShippingAddress } from "@/types";
import { formatError } from "../utils";
import {
  paymentMethodSchema,
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
} from "../validators";

//* Sign in the user with credentials
export async function signInWithCredentials(
  _prevState: unknown,
  formData: FormData,
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", user);

    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: "Invalid credentials" };
  }
}

//* Sign user out
export async function signOutUser() {
  await signOut();
}

//* Sign up user
export async function signUpUser(_prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const plainPassword = user.password;

    user.password = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: "Signed up successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: formatError(error) };
  }
}

//* Get user by ID
export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");

  return user;
}

//* Update the user's address
export async function updateUserAddress(shippingAddress: ShippingAddress) {
  try {
    const session = await auth();
    const currentUser = await getUserById(session?.user?.id as string);

    if (!currentUser) throw new Error("User not found");

    const address = shippingAddressSchema.parse(shippingAddress);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        address,
      },
    });

    return {
      success: true,
      message: "Address updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: await formatError(error),
    };
  }
}

//* Update user's payment method
export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>,
) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id as string },
    });

    if (!currentUser) throw new Error("User not found");

    const paymentMethod = paymentMethodSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { paymentMethod: paymentMethod.type },
    });

    return {
      success: true,
      message: "User's payment method updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: await formatError(error),
    };
  }
}
