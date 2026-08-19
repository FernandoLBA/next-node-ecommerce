"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/db/db";
import { InsertProduct, SortingProductsOptions, UpdateProduct } from "@/types";
import { appRoutes, LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
import { Prisma } from "../generated/prisma/client";
import {
  convertToPlainObject,
  formatError,
  getUploadThingImageKey,
} from "../utils";
import { insertProductSchema, updateProductSchema } from "../validators";
import { deleteImageFromUploadthing } from "./uploadthing.action";

/**
 * Get latest products
 *
 * @returns
 */
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: {
      createdAt: "desc",
    },
  });

  return convertToPlainObject(data);
}

/**
 * Get single product by it's slug
 *
 * @param slug
 * @returns
 */
export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: {
      slug,
    },
  });
}

/**
 * Get single product by it's ID
 *
 * @param productId
 * @returns
 */
export async function getProductById(productId: string) {
  const data = await prisma.product.findFirst({
    where: { id: productId },
  });

  return convertToPlainObject(data);
}

/**
 * Get all products for admin
 *
 * @param param0
 * @returns
 */
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
  price?: string;
  rating?: string;
  sort?: SortingProductsOptions;
}) {
  //? Query filter
  const queryFilter: Prisma.ProductWhereInput =
    query && query !== "all"
      ? {
          name: { contains: query, mode: "insensitive" } as Prisma.StringFilter,
        }
      : {};

  //? Category filter
  const categoryFilter: Prisma.ProductWhereInput =
    category && category !== "all" ? { category } : {};

  //? Price or price range filter
  const priceFilter: Prisma.ProductWhereInput =
    price && price !== "all"
      ? {
          price: {
            gte: Number(price.split("-")[0]), //? from price (gte = greater than)
            lte: Number(price.split("-")[1]), //? to price (lte = lower than)
          } as Prisma.IntFilter,
        }
      : {};

  //* Rating or rating range filter
  const ratingFilter: Prisma.ProductWhereInput =
    rating && rating !== "all" ? { rating: { gte: Number(rating) } } : {};

  //* Unified where filters
  const where: Prisma.ProductWhereInput = {
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  };

  //* Assign the sort by condition
  const sortAssigner = (
    sort?: SortingProductsOptions,
  ): Prisma.ProductOrderByWithRelationInput => {
    switch (sort) {
      case "highest":
        return { price: "desc" };
      case "lowest":
        return { price: "asc" };
      case "rating":
        return { rating: "desc" };
      default:
        return { createdAt: "desc" };
    }
  };

  //* Conditional order assignament
  const orderBy: Prisma.ProductOrderByWithRelationInput = sortAssigner(sort);

  const [data, count] = await prisma.$transaction([
    prisma.product.findMany({
      orderBy,
      where,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    data,
    totalPages: Math.ceil(count / limit),
  };
}

/**
 * Delete a product by id
 *
 * @param id
 * @returns
 */
export async function deleteProductById(id: string) {
  try {
    const productExists = await prisma.product.findFirst({
      where: { id },
    });

    if (!productExists) return { success: false, message: "Product not found" };

    await prisma.product.delete({ where: { id } });

    productExists.images.forEach(async (image) => {
      const imageKey = getUploadThingImageKey(image);

      await deleteImageFromUploadthing(imageKey as string);
    });

    if (productExists.banner && productExists.isFeatured) {
      const imageKey = getUploadThingImageKey(productExists.banner);

      await deleteImageFromUploadthing(imageKey as string);
    }

    revalidatePath(appRoutes.ADMIN_PRODUCTS);

    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

/**
 * Create a new product
 *
 * @param data
 * @returns
 */
export async function createProduct(data: InsertProduct) {
  try {
    const product = insertProductSchema.parse(data);

    await prisma.product.create({
      data: {
        ...product,
        numReviews: 0,
      },
    });

    revalidatePath(appRoutes.ADMIN_PRODUCTS);

    return {
      success: true,
      message: "Product created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

/**
 * Update a  product
 *
 * @param data
 * @returns
 */
export async function updateProduct(data: UpdateProduct) {
  try {
    const product = updateProductSchema.parse(data);
    const productExists = await prisma.product.findFirst({
      where: { id: product.id },
    });

    if (!productExists) throw new Error("Product not found");

    await prisma.product.update({
      where: { id: product.id },
      data: { ...product, banner: product.isFeatured ? product.banner : null },
    });

    revalidatePath(appRoutes.ADMIN_PRODUCTS);

    return {
      success: true,
      message: "Product updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

/**
 * Get all categories
 *
 * @returns
 */
export async function getAllCategories() {
  const productDelegate = prisma.product as Prisma.ProductDelegate; //? ProductDelegate is a product model type, productDelegate is an instance of prisma.ProductDelegate

  const data = await productDelegate.groupBy({
    by: ["category"],
    _count: true,
  });

  return data;
}

/**
 * Get featured products
 *
 * @returns
 */
export async function getFeaturedProducts() {
  const data = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
  });

  return convertToPlainObject(data);
}
