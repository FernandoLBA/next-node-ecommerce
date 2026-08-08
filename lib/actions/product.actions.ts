"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/db/db";
import { InsertProduct, UpdateProduct } from "@/types";
import { appRoutes, LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
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
  const data = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
      category: category
        ? { contains: category, mode: "insensitive" }
        : undefined,
    },
    skip: (page - 1) * limit,
    take: limit,
  });

  const dataCount = await prisma.product.count({
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
      category: category
        ? { contains: category, mode: "insensitive" }
        : undefined,
    },
  });

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
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
