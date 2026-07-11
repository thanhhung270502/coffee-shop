import { prisma } from "@/libs/prisma";

const drinkInclude = {
  category: true,
  variants: true,
  toppings: { include: { topping: true } },
} as const;

const packagedInclude = {
  category: true,
  skus: true,
} as const;

export async function findDrinks(filters?: { categoryId?: string; search?: string }) {
  return prisma.product.findMany({
    where: {
      type: "DRINK",
      ...(filters?.categoryId ? { categoryId: filters.categoryId } : {}),
      ...(filters?.search
        ? { name: { contains: filters.search, mode: "insensitive" as const } }
        : {}),
    },
    include: drinkInclude,
    orderBy: { name: "asc" },
  });
}

export async function findPackagedProducts(filters?: { categoryId?: string; search?: string }) {
  return prisma.product.findMany({
    where: {
      type: "PACKAGED",
      ...(filters?.categoryId ? { categoryId: filters.categoryId } : {}),
      ...(filters?.search
        ? { name: { contains: filters.search, mode: "insensitive" as const } }
        : {}),
    },
    include: packagedInclude,
    orderBy: { name: "asc" },
  });
}

export async function findProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      variants: true,
      toppings: { include: { topping: true } },
      skus: true,
    },
  });
}

export async function findProductBySlug(slug: string) {
  return prisma.product.findUnique({ where: { slug } });
}

export async function findPublicDrinks(filters?: { categorySlug?: string }) {
  return prisma.product.findMany({
    where: {
      type: "DRINK",
      isActive: true,
      category: { isActive: true },
      ...(filters?.categorySlug ? { category: { slug: filters.categorySlug, isActive: true } } : {}),
    },
    include: drinkInclude,
    orderBy: { name: "asc" },
  });
}

export async function findPublicDrinkBySlug(slug: string) {
  return prisma.product.findFirst({
    where: {
      slug,
      type: "DRINK",
      isActive: true,
      category: { isActive: true },
    },
    include: drinkInclude,
  });
}

export async function findPublicPackagedProducts(filters?: { categorySlug?: string }) {
  return prisma.product.findMany({
    where: {
      type: "PACKAGED",
      isActive: true,
      category: { isActive: true },
      ...(filters?.categorySlug ? { category: { slug: filters.categorySlug, isActive: true } } : {}),
    },
    include: packagedInclude,
    orderBy: { name: "asc" },
  });
}

export async function findPublicPackagedProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: {
      slug,
      type: "PACKAGED",
      isActive: true,
      category: { isActive: true },
    },
    include: packagedInclude,
  });
}

export async function findCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function createDrink(data: {
  name: string;
  slug: string;
  categoryId: string;
  description?: string;
  image?: string;
  variants: { name: string; price: number }[];
  toppingIds: string[];
}) {
  return prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      type: "DRINK",
      categoryId: data.categoryId,
      description: data.description,
      image: data.image,
      variants: { create: data.variants },
      toppings: {
        create: data.toppingIds.map((toppingId) => ({ toppingId })),
      },
    },
    include: drinkInclude,
  });
}

export async function createPackagedProduct(data: {
  name: string;
  slug: string;
  categoryId: string;
  description?: string;
  image?: string;
  skus: { label: string; sku?: string; price: number; stock: number }[];
}) {
  return prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      type: "PACKAGED",
      categoryId: data.categoryId,
      description: data.description,
      image: data.image,
      skus: { create: data.skus },
    },
    include: packagedInclude,
  });
}

export async function updateProductBase(
  id: string,
  data: {
    name?: string;
    slug?: string;
    categoryId?: string;
    description?: string | null;
    image?: string | null;
    isActive?: boolean;
  },
) {
  return prisma.product.update({ where: { id }, data });
}

export async function replaceDrinkVariants(
  productId: string,
  variants: { name: string; price: number }[],
) {
  await prisma.productVariant.deleteMany({ where: { productId } });
  await prisma.productVariant.createMany({
    data: variants.map((v) => ({ productId, name: v.name, price: v.price })),
  });
}

export async function replaceProductToppings(productId: string, toppingIds: string[]) {
  await prisma.productTopping.deleteMany({ where: { productId } });
  if (toppingIds.length > 0) {
    await prisma.productTopping.createMany({
      data: toppingIds.map((toppingId) => ({ productId, toppingId })),
    });
  }
}

export async function replaceProductSkus(
  productId: string,
  skus: { label: string; sku?: string; price: number; stock: number }[],
) {
  await prisma.productSku.deleteMany({ where: { productId } });
  await prisma.productSku.createMany({
    data: skus.map((s) => ({
      productId,
      label: s.label,
      sku: s.sku,
      price: s.price,
      stock: s.stock,
    })),
  });
}

export async function updateSkuStock(skuId: string, stock: number) {
  return prisma.productSku.update({ where: { id: skuId }, data: { stock } });
}

export async function findCategoryById(id: string) {
  return prisma.category.findUnique({ where: { id } });
}
