import type { ProductType } from "@/generated/prisma";
import { prisma } from "@/libs/prisma";

type CategoryListFilters = {
  limit: number;
  offset: number;
  type?: ProductType;
  search?: string;
};

function buildCategoryListWhere(filters: Omit<CategoryListFilters, "limit" | "offset">) {
  const search = filters.search?.trim();

  return {
    ...(filters.type ? { type: filters.type } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { slug: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };
}

export async function findCategories(filters: CategoryListFilters) {
  const where = buildCategoryListWhere(filters);

  const [total_record, categories] = await Promise.all([
    prisma.category.count({ where }),
    prisma.category.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: { _count: { select: { products: true } } },
      skip: filters.offset,
      take: filters.limit,
    }),
  ]);

  return { total_record, categories };
}

export async function findAllCategories(type?: ProductType) {
  return prisma.category.findMany({
    where: type ? { type } : undefined,
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: {
      _count: { select: { products: true } },
    },
  });
}

export async function findActiveCategories(type?: ProductType) {
  return prisma.category.findMany({
    where: {
      isActive: true,
      ...(type ? { type } : {}),
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function findCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id },
    include: {
      _count: { select: { products: true } },
    },
  });
}

export async function findCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function createCategory(data: {
  name: string;
  slug: string;
  type: ProductType;
  sortOrder: number;
}) {
  return prisma.category.create({ data });
}

export async function updateCategory(
  id: string,
  data: { name?: string; slug?: string; sortOrder?: number; isActive?: boolean },
) {
  return prisma.category.update({ where: { id }, data });
}

export async function deleteCategory(id: string) {
  return prisma.category.delete({ where: { id } });
}

export async function countCategoryProducts(id: string) {
  return prisma.product.count({ where: { categoryId: id } });
}
