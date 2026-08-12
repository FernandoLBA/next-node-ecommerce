"use server";

import z from "zod";

import { auth } from "@/auth";
import prisma from "@/db/db";
import { revalidatePath } from "next/cache";
import { appRoutes } from "../constants";
import { TransactionClient } from "../generated/prisma/internal/prismaNamespace";
import { formatError } from "../utils";
import { insertReviewsSchema } from "../validators";

export async function createUpdateReview(
  data: z.infer<typeof insertReviewsSchema>,
) {
  try {
    const session = await auth();

    if (!session) throw new Error("User not authenticated");

    //* validate and store the review
    const review = insertReviewsSchema.parse({
      ...data,
      userId: session.user.id,
    });

    //* Get product that is being reviewed
    const product = await prisma.product.findFirst({
      where: { id: review.productId },
    });

    if (!product) throw new Error("Product not found");

    //* CHeck if already reviewed
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
      message: "Review successfully updated",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
