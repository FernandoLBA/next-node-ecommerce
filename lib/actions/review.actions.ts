"use server";

import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import z from "zod";

import { auth } from "@/auth";
import prisma from "@/db/db";
import { appRoutes } from "../constants";
import { TransactionClient } from "../generated/prisma/internal/prismaNamespace";
import { formatError } from "../utils";
import { insertReviewsSchema } from "../validators";

/**
 * Creates the review of a product and update the product review property
 *
 * @param data
 * @returns
 */
export async function createUpdateReview(
  data: z.infer<typeof insertReviewsSchema>,
) {
  const t = await getTranslations("Messages");

  try {
    const session = await auth();

    if (!session) throw new Error(t("userNotAuthenticated"));

    //? validate and store the review
    const review = insertReviewsSchema.parse({
      ...data,
      userId: session.user.id,
    });

    //? Get product that is being reviewed
    const product = await prisma.product.findFirst({
      where: { id: review.productId },
      select: {
        slug: true,
        orderItems: {
          select: { order: true },
        },
      },
    });

    const userBoughtThisProduct = product?.orderItems.some(
      (p: { order: { userId: string } }) => p.order.userId === session.user.id,
    );

    if (!userBoughtThisProduct)
      throw new Error(t("mustBuyFirst"));

    if (!product) throw new Error(t("productNotFound"));

    //? CHeck if already reviewed
    const reviewExists = await prisma.review.findFirst({
      where: {
        productId: review.productId,
        userId: session.user.id,
      },
    });

    await (
      prisma.$transaction as unknown as <T>(
        arg: (tx: TransactionClient) => Promise<T>,
      ) => Promise<T>
    )(async (tx) => {
      if (reviewExists) {
        //? update review
        await tx.review.update({
          where: { id: reviewExists.id },
          data: {
            title: review.title,
            description: review.description,
            rating: review.rating,
          },
        });
      } else {
        //? Create review
        await tx.review.create({ data: review });
      }

      //? Get avg rating
      const averageRating = await tx.review.aggregate({
        _avg: { rating: true },
        where: { productId: review.productId },
      });

      //? Get number of reviews
      const numReviews = await tx.review.count({
        where: { productId: review.productId },
      });

      //? Uopdate the rating and numReviews in product table
      await tx.product.update({
        where: { id: review.productId },
        data: {
          rating: averageRating._avg.rating || 0,
          numReviews,
        },
      });
    });

    revalidatePath(`${appRoutes.PRODUCTS}/${product.slug}`);

    return {
      success: true,
      message: t("reviewUpdated"),
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error, t),
    };
  }
}

/**
 * Get all review for a product
 *
 * @param param0
 * @returns
 */
export async function getReviews({ productId }: { productId: string }) {
  const data = await prisma.review.findMany({
    where: { productId },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { data };
}

/**
 * Get a review written by the current user
 *
 * @param param0
 * @returns
 */
export async function getReviewByProductId({
  productId,
}: {
  productId: string;
}) {
  const t = await getTranslations("Messages");

  const session = await auth();

  if (!session) throw new Error(t("userNotAuthenticated"));

  return await prisma.review.findFirst({
    where: { productId, userId: session.user.id },
  });
}
