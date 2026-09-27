"use server";

import { getTranslations } from "next-intl/server";
import { hashSync } from "bcrypt-ts-edge";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate";
import { cookies } from "next/headers";
import z from "zod";

import { auth, signIn, signOut } from "@/auth";
import prisma from "@/db/db";
import { redirect } from "@/i18n/routing";
import { ShippingAddress, UpdateUser, User } from "@/types";
import { appRoutes, DEFAULT_LANGUAGE, PAGE_SIZE } from "../constants";
import { Prisma } from "../generated/prisma/browser";
import { convertToPlainObject, formatError } from "../utils";
import {
  paymentMethodSchema,
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
  updateUserProfileSchema,
} from "../validators";

/**
 * Sign in the user with credentials
 *
 * @param _prevState
 * @param formData
 * @returns
 */
export async function signInWithCredentials(
  _prevState: unknown,
  formData: FormData,
) {
  const t = await getTranslations("Messages");

  const callbackUrl = (await cookies()).get("authjs.callback-url");
  const locale = callbackUrl?.value.split("/")[3] || DEFAULT_LANGUAGE;

  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", user);

    if (callbackUrl?.value) {
      redirect({
        href: callbackUrl?.value,
        locale: locale,
      });
    }

    return { success: true, message: t("signedIn") };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: t("invalidCredentials") };
  }
}

/**
 * Sign user out and clear the cookies
 *
 */
export async function signOutUser() {
  (await cookies()).delete("authjs.csrf-token");
  (await cookies()).delete("authjs.session-token");
  (await cookies()).delete("sessionCartId");

  const callbackUrl = (await cookies()).get("authjs.callback-url");
  const locale = callbackUrl?.value.split("/")[3] || DEFAULT_LANGUAGE;

  await signOut();

  if (callbackUrl?.value) {
    redirect({ href: callbackUrl.value, locale });
  }
}

/**
 * Sign up user
 *
 * @param _prevState
 * @param formData
 * @returns
 */
export async function signUpUser(_prevState: unknown, formData: FormData) {
  const t = await getTranslations("Messages");

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

    return { success: true, message: t("signedUp") };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: formatError(error, t) };
  }
}

/**
 * Get user by ID
 *
 * @param userId
 * @returns
 */
export async function getUserById(userId: string) {
  const t = await getTranslations("Messages");

  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) throw new Error(t("userNotFound"));

  return user;
}

/**
 * Update the user's address
 *
 * @param shippingAddress
 * @returns
 */
export async function updateUserAddress(shippingAddress: ShippingAddress) {
  const t = await getTranslations("Messages");

  try {
    const session = await auth();
    const currentUser = await getUserById(session?.user?.id as string);

    if (!currentUser) throw new Error(t("userNotFound"));

    const address = shippingAddressSchema.parse(shippingAddress);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        address,
      },
    });

    return {
      success: true,
      message: t("addressUpdated"),
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error, t),
    };
  }
}

/**
 * Update user's payment method
 *
 * @param data
 * @returns
 */
export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>,
) {
  const t = await getTranslations("Messages");

  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id as string },
    });

    if (!currentUser) throw new Error(t("userNotFound"));

    const paymentMethod = paymentMethodSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { paymentMethod: paymentMethod.type },
    });

    return {
      success: true,
      message: t("paymentMethodUpdated"),
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error, t),
    };
  }
}

/**
 * Update the user's profile
 *
 * @param user
 * @returns
 */
export async function updateProfile(
  user: z.infer<typeof updateUserProfileSchema>,
) {
  const t = await getTranslations("Messages");

  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id as string },
    });

    if (!currentUser) throw new Error(t("userNotFound"));

    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name: user.name,
        email: user.email,
      },
    });

    return {
      success: true,
      message: t("profileUpdated"),
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error, t),
    };
  }
}

/**
 * Get all the users
 *
 * @param param0
 * @returns
 */
export async function getAllUsers({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}) {
  const matchCondition: Prisma.UserWhereInput =
    query && query !== "all"
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          } as Prisma.StringFilter,
        }
      : {};

  const [data, count] = await prisma.$transaction([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: (page - 1) * limit,
      where: { ...matchCondition },
    }),
    prisma.user.count({
      where: { ...matchCondition },
    }),
  ]);

  return {
    data: data.map((user) => convertToPlainObject(user)) as User[],
    totalPages: Math.ceil(count / limit),
  };
}

/**
 * Delete a user by ID
 *
 * @param userId
 * @returns
 */
export async function deleteUserById(userId: string) {
  const t = await getTranslations("Messages");

  try {
    const userExists = await prisma.user.findFirst({ where: { id: userId } });

    if (!userExists) throw new Error(t("userNotFound"));

    await prisma.user.delete({ where: { id: userId } });

    revalidatePath(appRoutes.ADMIN_USERS);

    return {
      success: true,
      message: t("userDeleted"),
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error, t),
    };
  }
}

/**
 * Update a user
 *
 * @param user
 * @returns
 */
export async function updateUser(user: UpdateUser) {
  const t = await getTranslations("Messages");

  try {
    const userExists = await getUserById(user.id);

    if (!userExists) throw new Error(t("userNotFound"));

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
      message: t("userUpdated"),
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error, t),
    };
  }
}
