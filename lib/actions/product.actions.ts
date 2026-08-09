"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/db/db";
import { InsertProduct, UpdateProduct } from "@/types";
import { appRoutes, LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
import { Prisma } from "../generated/prisma/client";
import { convertToPlainObject, formatError } from "../utils";
import { insertProductSchema, updateProductSchema } from "../validators";

//* Get latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: {
      createdAt: "desc",
    },
  });

  return convertToPlainObject(data);
}

//* Get single product by it's slug
export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: {
      slug,
    },
  });
}

//* Get single product by it's ID
export async function getProductById(productId: string) {
  const data = await prisma.product.findFirst({
    where: { id: productId },
  });

  return convertToPlainObject(data);
}

//* Get all products for admin
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
}) {
  const matchCondition: Prisma.ProductWhereInput =
    query && query !== "all"
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          } as Prisma.StringFilter,
        }
      : {};

  const [data, count] = await prisma.$transaction([
    prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
      where: { ...matchCondition },
    }),
    prisma.product.count({
      where: { ...matchCondition },
    }),
  ]);

  return {
    data,
    totalPages: Math.ceil(count / limit),
  };
}

//* Delete a product by id
export async function deleteproduct(id: string) {
  try {
    const productExists = await prisma.product.findFirst({
      where: { id },
    });

    if (!productExists) {
      throw new Error("Product not found");
    }

    await prisma.product.delete({ where: { id } });

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

//* Create a new product
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

//* Update a  product
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

//* Get all categories
export async function getAllCategories() {
  const productDelegate = prisma.product as Prisma.ProductDelegate;

  const data = await productDelegate.groupBy({
    by: ["category"],
    _count: true,
  });

  return data;
}

//* Get featured products
export async function getFeaturedProducts() {
  const data = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
  });
  console.log("🚀 ~ getFeaturedProducts ~ data:", data)

  return convertToPlainObject(data);
}
