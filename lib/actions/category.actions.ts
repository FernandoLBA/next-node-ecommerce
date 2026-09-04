"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/db/db";
import { Category, SortingCategoriesOptions } from "@/types";
import { appRoutes } from "../constants";
import { PAGE_SIZE } from "../constants/index";
import { Prisma } from "../generated/prisma/client";
import { convertToPlainObject, formatError } from "../utils";

/**
 * Get all categories from db
 * @returns
 */
export async function getAllCategories({
  query,
  limit = PAGE_SIZE,
  page,
  sort,
}: {
  query: string;
  limit?: number;
  page: number;
  sort?: SortingCategoriesOptions;
}) {
  const queryFilter: Prisma.CategoryWhereInput =
    query && query !== "all"
      ? {
          name: { contains: query, mode: "insensitive" } as Prisma.StringFilter,
        }
      : {};

  const where: Prisma.CategoryWhereInput = {
    ...queryFilter,
  };

  const sortAssigner = (
    sort?: SortingCategoriesOptions,
  ): Prisma.CategoryOrderByWithRelationInput => {
    switch (sort) {
      case "newest":
        return { createdAt: "desc" };
      case "oldest":
        return { createdAt: "asc" };
      default:
        return { createdAt: "desc" };
    }
  };

  const orderBy: Prisma.CategoryOrderByWithRelationInput = sortAssigner(sort);

  const [data, count] = await prisma.$transaction([
    prisma.category.findMany({
      orderBy,
      where,
      skip: (page - 1) * limit,
      take: limit,
    }),

    prisma.category.count({ where }),
  ]);

  return {
    data: data.map((category) => convertToPlainObject(category)) as Category[],
    totalPages: Math.ceil(count / limit),
  };
}

/**
 * Get the top 5 categories on sales
 * Default limit: 5
 * @param limit
 * @returns
 */
export async function getBestFiveCategories(limit: number = 5) {
  const res = await prisma.category.findMany({
    take: limit,
  });

  return convertToPlainObject(res) as Category[];
}

/**
 * Deletes a category by id, and detach its products from this category
 *
 * @param id
 * @returns
 */
export async function deleteCategoryById(id: string) {
  try {
    const categoryExists = await prisma.category.findFirst({ where: { id } });

    if (!categoryExists)
      return { success: false, message: "Category not found" };

    await prisma.category.delete({ where: { id } });

    revalidatePath(appRoutes.ADMIN_CATEGORIES);

    return {
      success: true,
      message: "Category deleted succesfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
