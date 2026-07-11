import type { PublicDrinkObject, PublicProductObject } from "@common/models/catalog";
import type {
  DrinkObject,
  PackagedProductObject,
} from "@common/models/product";

import { AppError } from "@/libs/errors";
import { slugify } from "@/shared/utils/slug.util";

import {
  createDrink,
  createPackagedProduct,
  findCategoryById,
  findDrinks,
  findPackagedProducts,
  findProductById,
  findProductBySlug,
  findPublicDrinkBySlug,
  findPublicDrinks,
  findPublicPackagedProductBySlug,
  findPublicPackagedProducts,
  replaceDrinkVariants,
  replaceProductSkus,
  replaceProductToppings,
  updateProductBase,
  updateSkuStock,
} from "./product.repository";
import type {
  CreateDrinkInput,
  CreatePackagedProductInput,
  UpdateDrinkInput,
  UpdatePackagedProductInput,
  UpdateProductStockInput,
} from "./product.schema";

type DrinkWithRelations = Awaited<ReturnType<typeof findDrinks>>[number];
type PackagedWithRelations = Awaited<ReturnType<typeof findPackagedProducts>>[number];
type PublicDrinkWithRelations = Awaited<ReturnType<typeof findPublicDrinks>>[number];
type PublicPackagedWithRelations = Awaited<ReturnType<typeof findPublicPackagedProducts>>[number];

function toPublicDrinkObject(product: PublicDrinkWithRelations): PublicDrinkObject {
  const activeToppings = product.toppings
    .filter((pt) => pt.topping.isActive)
    .map((pt) => ({
      id: pt.topping.id,
      name: pt.topping.name,
      price: pt.topping.price,
    }));
  const minPrice = product.variants.length
    ? Math.min(...product.variants.map((v) => v.price))
    : 0;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    image: product.image,
    categoryId: product.categoryId,
    categoryName: product.category.name,
    categorySlug: product.category.slug,
    variants: product.variants.map((v) => ({ id: v.id, name: v.name, price: v.price })),
    toppings: activeToppings,
    minPrice,
  };
}

function toPublicProductObject(product: PublicPackagedWithRelations): PublicProductObject {
  const skus = product.skus.map((s) => ({
    id: s.id,
    label: s.label,
    sku: s.sku,
    price: s.price,
    stock: s.stock,
  }));
  const inStockSkus = skus.filter((s) => s.stock > 0);
  const minPrice = inStockSkus.length
    ? Math.min(...inStockSkus.map((s) => s.price))
    : skus.length
      ? Math.min(...skus.map((s) => s.price))
      : 0;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    image: product.image,
    categoryId: product.categoryId,
    categoryName: product.category.name,
    categorySlug: product.category.slug,
    skus,
    minPrice,
    inStock: skus.some((s) => s.stock > 0),
  };
}

function toDrinkObject(product: DrinkWithRelations): DrinkObject {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    image: product.image,
    isActive: product.isActive,
    categoryId: product.categoryId,
    categoryName: product.category.name,
    variants: product.variants.map((v) => ({ id: v.id, name: v.name, price: v.price })),
    toppings: product.toppings.map((pt) => ({
      id: pt.topping.id,
      name: pt.topping.name,
      price: pt.topping.price,
    })),
  };
}

function toPackagedObject(product: PackagedWithRelations): PackagedProductObject {
  const totalStock = product.skus.reduce((sum, sku) => sum + sku.stock, 0);
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    image: product.image,
    isActive: product.isActive,
    categoryId: product.categoryId,
    categoryName: product.category.name,
    skus: product.skus.map((s) => ({
      id: s.id,
      label: s.label,
      sku: s.sku,
      price: s.price,
      stock: s.stock,
    })),
    totalStock,
  };
}

async function uniqueSlug(baseName: string, excludeId?: string): Promise<string> {
  let slug = slugify(baseName);
  let counter = 1;
  while (true) {
    const existing = await findProductBySlug(slug);
    if (!existing || existing.id === excludeId) return slug;
    slug = `${slugify(baseName)}-${counter}`;
    counter += 1;
  }
}

async function validateCategory(categoryId: string, expectedType: "DRINK" | "PACKAGED") {
  const category = await findCategoryById(categoryId);
  if (!category) throw new AppError("Category not found", 404);
  if (category.type !== expectedType) {
    throw new AppError("Category type does not match product type", 400);
  }
  return category;
}

export async function listDrinks(filters?: {
  categoryId?: string;
  search?: string;
}): Promise<DrinkObject[]> {
  const drinks = await findDrinks(filters);
  return drinks.map(toDrinkObject);
}

export async function getDrinkById(id: string): Promise<DrinkObject> {
  const product = await findProductById(id);
  if (!product || product.type !== "DRINK") {
    throw new AppError("Drink not found", 404);
  }
  return toDrinkObject(product as DrinkWithRelations);
}

export async function createDrinkService(input: CreateDrinkInput): Promise<DrinkObject> {
  await validateCategory(input.categoryId, "DRINK");
  const slug = await uniqueSlug(input.name);
  const drink = await createDrink({
    name: input.name,
    slug,
    categoryId: input.categoryId,
    description: input.description,
    image: input.image || undefined,
    variants: input.variants,
    toppingIds: input.toppingIds ?? [],
  });
  return toDrinkObject(drink);
}

export async function updateDrinkService(id: string, input: UpdateDrinkInput): Promise<DrinkObject> {
  const existing = await findProductById(id);
  if (!existing || existing.type !== "DRINK") {
    throw new AppError("Drink not found", 404);
  }

  if (input.categoryId) {
    await validateCategory(input.categoryId, "DRINK");
  }

  const slug = input.name ? await uniqueSlug(input.name, id) : undefined;
  await updateProductBase(id, {
    name: input.name,
    slug,
    categoryId: input.categoryId,
    description: input.description,
    image: input.image,
    isActive: input.isActive,
  });

  if (input.variants) {
    await replaceDrinkVariants(id, input.variants);
  }
  if (input.toppingIds) {
    await replaceProductToppings(id, input.toppingIds);
  }

  return getDrinkById(id);
}

export async function updateDrinkStatusService(
  id: string,
  isActive: boolean,
): Promise<DrinkObject> {
  const existing = await findProductById(id);
  if (!existing || existing.type !== "DRINK") {
    throw new AppError("Drink not found", 404);
  }
  await updateProductBase(id, { isActive });
  return getDrinkById(id);
}

export async function listPackagedProducts(filters?: {
  categoryId?: string;
  search?: string;
}): Promise<PackagedProductObject[]> {
  const products = await findPackagedProducts(filters);
  return products.map(toPackagedObject);
}

export async function getPackagedProductById(id: string): Promise<PackagedProductObject> {
  const product = await findProductById(id);
  if (!product || product.type !== "PACKAGED") {
    throw new AppError("Product not found", 404);
  }
  return toPackagedObject(product as PackagedWithRelations);
}

export async function createPackagedProductService(
  input: CreatePackagedProductInput,
): Promise<PackagedProductObject> {
  await validateCategory(input.categoryId, "PACKAGED");
  const slug = await uniqueSlug(input.name);
  const product = await createPackagedProduct({
    name: input.name,
    slug,
    categoryId: input.categoryId,
    description: input.description,
    image: input.image || undefined,
    skus: input.skus.map((s) => ({
      label: s.label,
      sku: s.sku,
      price: s.price,
      stock: s.stock ?? 0,
    })),
  });
  return toPackagedObject(product);
}

export async function updatePackagedProductService(
  id: string,
  input: UpdatePackagedProductInput,
): Promise<PackagedProductObject> {
  const existing = await findProductById(id);
  if (!existing || existing.type !== "PACKAGED") {
    throw new AppError("Product not found", 404);
  }

  if (input.categoryId) {
    await validateCategory(input.categoryId, "PACKAGED");
  }

  const slug = input.name ? await uniqueSlug(input.name, id) : undefined;
  await updateProductBase(id, {
    name: input.name,
    slug,
    categoryId: input.categoryId,
    description: input.description,
    image: input.image,
    isActive: input.isActive,
  });

  if (input.skus) {
    await replaceProductSkus(
      id,
      input.skus.map((s) => ({
        label: s.label,
        sku: s.sku,
        price: s.price,
        stock: s.stock ?? 0,
      })),
    );
  }

  return getPackagedProductById(id);
}

export async function updateProductStockService(
  productId: string,
  input: UpdateProductStockInput,
): Promise<PackagedProductObject> {
  const product = await findProductById(productId);
  if (!product || product.type !== "PACKAGED") {
    throw new AppError("Product not found", 404);
  }

  const sku = product.skus.find((s) => s.id === input.skuId);
  if (!sku) {
    throw new AppError("SKU not found", 404);
  }

  await updateSkuStock(input.skuId, input.stock);
  return getPackagedProductById(productId);
}

export async function listPublicDrinks(categorySlug?: string): Promise<PublicDrinkObject[]> {
  const drinks = await findPublicDrinks(
    categorySlug ? { categorySlug } : undefined,
  );
  return drinks.map(toPublicDrinkObject);
}

export async function getPublicDrinkBySlug(slug: string): Promise<PublicDrinkObject> {
  const drink = await findPublicDrinkBySlug(slug);
  if (!drink) {
    throw new AppError("Drink not found", 404);
  }
  return toPublicDrinkObject(drink);
}

export async function listPublicProducts(categorySlug?: string): Promise<PublicProductObject[]> {
  const products = await findPublicPackagedProducts(
    categorySlug ? { categorySlug } : undefined,
  );
  return products.map(toPublicProductObject);
}

export async function getPublicProductBySlug(slug: string): Promise<PublicProductObject> {
  const product = await findPublicPackagedProductBySlug(slug);
  if (!product) {
    throw new AppError("Product not found", 404);
  }
  return toPublicProductObject(product);
}
