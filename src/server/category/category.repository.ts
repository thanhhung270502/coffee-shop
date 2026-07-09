import type { ProductType } from "@/generated/prisma";
import { prisma } from "@/libs/prisma";

export async function findAllCategories(type?: ProductType) {
  return prisma.category.findMany({
    where: type ? { type } : undefined,
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: {
      _count: { select: { products: true } },
    },
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
