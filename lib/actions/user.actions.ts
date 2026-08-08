"use server";

import { hashSync } from "bcrypt-ts-edge";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import z from "zod";

import { auth, signIn, signOut } from "@/auth";
import prisma from "@/db/db";
import { ShippingAddress, UpdateUser } from "@/types";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate";
import { appRoutes, PAGE_SIZE } from "../constants";
import { formatError } from "../utils";
import {
  paymentMethodSchema,
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
  updateUserProfileSchema,
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
      message: formatError(error),
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
      message: formatError(error),
    };
  }
}

//* Update the user's profile
export async function updateProfile(
  user: z.infer<typeof updateUserProfileSchema>,
) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id as string },
    });

    if (!currentUser) throw new Error("User not found");

    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name: user.name,
        email: user.email,
      },
    });

    return {
      success: true,
      message: "User's profile updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

//* Get all the users
export async function getAllUsers({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const data = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.user.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

//* Delete a user by ID
export async function deleteUserById(userId: string) {
  try {
    const userExists = await prisma.user.findFirst({ where: { id: userId } });

    if (!userExists) throw new Error("User not found");

    await prisma.user.delete({ where: { id: userId } });

    revalidatePath(appRoutes.ADMIN_USERS);

    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

//* Update a user
export async function updateUser(user: UpdateUser) {
  try {
    const userExists = await getUserById(user.id);

    if (!userExists) throw new Error("User not found");

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        role: user.role,
        updatedAt: new Date(),
      },
    });

    revalidatePath(appRoutes.ADMIN_USERS);

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
