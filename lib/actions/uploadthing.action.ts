"use server";

import { UTApi } from "uploadthing/server";

import prisma from "@/db/db";
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
  const imageKey = getUploadThingImageKey(imageUrl);

  try {
    const productExists = await getProductById(productId);

    if (!productExists)
      return {
        success: false,
        message: "Product not found",
      };

    const res = await deleteImageFromUploadthing(imageKey as string);

    if (!res.success)
      return {
        success: res.success,
        message: "An error occurred while deleting image",
      };

    const updatedImages = productExists.images.filter(
      (image) => image !== imageUrl,
    );

    await prisma.product.update({
      where: { id: productExists?.id },
      data: {
        images: updatedImages,
      },
    });

    return {
      success: true,
      message: "Image deleted succesfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
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
  const imageKey = getUploadThingImageKey(imageUrl);

  try {
    const productExists = await getProductById(productId);

    if (!productExists)
      return {
        success: false,
        message: "Product not found",
      };

    const res = await deleteImageFromUploadthing(imageKey as string);

    if (!res.success)
      return {
        success: res.success,
        message: "An error occurred while deleting banner image",
      };

    await prisma.product.update({
      where: { id: productExists?.id },
      data: {
        banner: null,
      },
    });

    return {
      success: true,
      message: "Image banner deleted succesfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
