"use server";

import { getTranslations } from "next-intl/server";
import { UTApi } from "uploadthing/server";

import prisma from "@/db/db";
import { revalidatePath } from "next/cache";
import { appRoutes } from "../constants";
import { formatError, getUploadThingImageKey } from "../utils";
import { getProductById } from "./product.actions";

const utapi = new UTApi();

/**
 * Delete an image by key from uploadthing
 *
 * @param fileKey
 * @returns
 */
export async function deleteImageFromUploadthing(fileKey: string) {
  return await utapi.deleteFiles(fileKey);
}

/**
 * Delete an image from Uploadthing server and updates the product images
 *
 * @param param0
 * @returns
 */
export async function deleteUTFFileFromProducts({
  imageUrl,
  productId,
}: {
  imageUrl: string;
  productId: string;
}) {
  const t = await getTranslations("Messages");

  const imageKey = getUploadThingImageKey(imageUrl);

  try {
    const productExists = await getProductById(productId);

    if (!productExists)
      return {
        success: false,
        message: t("productNotFound"),
      };

    const res = await deleteImageFromUploadthing(imageKey as string);

    if (!res.success)
      return {
        success: res.success,
        message: t("imageDeleteError"),
      };

    const updatedImages = productExists.images.filter(
      (image: string) => image !== imageUrl,
    );

    await prisma.product.update({
      where: { id: productExists?.id },
      data: {
        images: updatedImages,
      },
    });

    return {
      success: true,
      message: t("imageDeleted"),
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error, t),
    };
  }
}

/**
 * Delete a banner image from Uploadthing server and updates the product banner
 *
 * @param param0
 * @returns
 */
export async function deleteBannerUTFFileFromProducts({
  imageUrl,
  productId,
}: {
  imageUrl: string;
  productId: string;
}) {
  const t = await getTranslations("Messages");

  const imageKey = getUploadThingImageKey(imageUrl);

  try {
    const productExists = await getProductById(productId);

    if (!productExists)
      return {
        success: false,
        message: t("productNotFound"),
      };

    const res = await deleteImageFromUploadthing(imageKey as string);

    if (!res.success)
      return {
        success: res.success,
        message: t("bannerDeleteError"),
      };

    await prisma.product.update({
      where: { id: productExists?.id },
      data: {
        banner: null,
      },
    });

    return {
      success: true,
      message: t("bannerDeleted"),
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error, t),
    };
  }
}

/**
 *
 * @param imageKey
 * @param categoryId
 * @returns
 */
export async function deleteUTFFileFromCategory(
  imageKey: string,
  categoryId: string,
) {
  const t = await getTranslations("Messages");

  try {
    const categoryExists = await prisma.category.findFirst({
      where: { id: categoryId },
    });

    if (!categoryExists)
      return {
        success: false,
        message: t("productNotFound"),
      };

    const res = await deleteImageFromUploadthing(imageKey);

    if (!res.success)
      return {
        success: false,
        message: t("imageDeleteError"),
      };

    await prisma.category.update({
      where: { id: categoryExists.id },
      data: {
        image: "",
        key: null,
      },
    });

    revalidatePath(`${appRoutes.ADMIN_CATEGORIES}/${categoryId}`);

    return {
      success: true,
      message: t("imageDeleted"),
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error, t),
    };
  }
}
