import type { PublicCategoryObject } from "@common/models/catalog";
import type { CategoryObject, EProductType } from "@common/models/category";

import type { ProductType } from "@/generated/prisma";
import { AppError } from "@/libs/errors";
import { slugify } from "@/shared/utils/slug.util";

import {
  countCategoryProducts,
  createCategory,
  deleteCategory,
  findActiveCategories,
  findAllCategories,
  findCategoryById,
  findCategoryBySlug,
  updateCategory,
} from "./category.repository";
import type { CreateCategoryInput, UpdateCategoryInput } from "./category.schema";
import type { CategoryWithCount } from "./category.types";

function toCategoryObject(category: CategoryWithCount): CategoryObject {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    type: category.type as EProductType,
    sortOrder: category.sortOrder,
    isActive: category.isActive,
    productCount: category._count.products,
  };
}

async function uniqueSlug(baseName: string, excludeId?: string): Promise<string> {
  let slug = slugify(baseName);
  let counter = 1;

  while (true) {
    const existing = await findCategoryBySlug(slug);
    if (!existing || existing.id === excludeId) {
      return slug;
    }
    slug = `${slugify(baseName)}-${counter}`;
    counter += 1;
  }
}

export async function listCategories(type?: ProductType): Promise<CategoryObject[]> {
  const categories = await findAllCategories(type);
  return categories.map(toCategoryObject);
}

export async function listPublicCategories(type?: ProductType): Promise<PublicCategoryObject[]> {
  const categories = await findActiveCategories(type);
  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    type: category.type as EProductType,
    sortOrder: category.sortOrder,
  }));
}

export async function createCategoryService(input: CreateCategoryInput): Promise<CategoryObject> {
  const slug = await uniqueSlug(input.name);
  const category = await createCategory({
    name: input.name,
    slug,
    type: input.type,
    sortOrder: input.sortOrder ?? 0,
  });

  return toCategoryObject({ ...category, _count: { products: 0 } });
}

export async function updateCategoryService(
  id: string,
  input: UpdateCategoryInput,
): Promise<CategoryObject> {
  const existing = await findCategoryById(id);
  if (!existing) {
    throw new AppError("Category not found", 404);
  }

  const slug = input.name ? await uniqueSlug(input.name, id) : undefined;
  const category = await updateCategory(id, {
    name: input.name,
    slug,
    sortOrder: input.sortOrder,
    isActive: input.isActive,
  });

  return toCategoryObject({ ...category, _count: existing._count });
}

export async function deleteCategoryService(id: string): Promise<{ ok: boolean }> {
  const existing = await findCategoryById(id);
  if (!existing) {
    throw new AppError("Category not found", 404);
  }

  const productCount = await countCategoryProducts(id);
  if (productCount > 0) {
    throw new AppError("Cannot delete category with existing products", 409);
  }

  await deleteCategory(id);
  return { ok: true };
}
