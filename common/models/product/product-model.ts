import type { EProductType } from "../category/category-model";

export type ProductVariantObject = {
  id: string;
  name: string;
  price: number;
};

export type ProductToppingRefObject = {
  id: string;
  name: string;
  price: number;
};

export type ProductSkuObject = {
  id: string;
  label: string;
  sku: string | null;
  price: number;
  stock: number;
};

export type DrinkObject = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  categoryId: string;
  categoryName: string;
  variants: ProductVariantObject[];
  toppings: ProductToppingRefObject[];
};

export type PackagedProductObject = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  categoryId: string;
  categoryName: string;
  skus: ProductSkuObject[];
  totalStock: number;
};

export type ListDrinksResponse = { drinks: DrinkObject[] };
export type GetDrinkResponse = { drink: DrinkObject };
export type ListPackagedProductsResponse = { products: PackagedProductObject[] };
export type GetPackagedProductResponse = { product: PackagedProductObject };

export type DrinkVariantInput = {
  name: string;
  price: number;
};

export type ProductSkuInput = {
  label: string;
  sku?: string;
  price: number;
  stock?: number;
};

export type CreateDrinkRequest = {
  name: string;
  categoryId: string;
  description?: string;
  image?: string;
  variants: DrinkVariantInput[];
  toppingIds?: string[];
};

export type UpdateDrinkRequest = {
  name?: string;
  categoryId?: string;
  description?: string | null;
  image?: string | null;
  isActive?: boolean;
  variants?: DrinkVariantInput[];
  toppingIds?: string[];
};

export type CreateDrinkResponse = { drink: DrinkObject };
export type UpdateDrinkResponse = { drink: DrinkObject };
export type UpdateDrinkStatusRequest = { isActive: boolean };
export type UpdateDrinkStatusResponse = { drink: DrinkObject };

export type CreatePackagedProductRequest = {
  name: string;
  categoryId: string;
  description?: string;
  image?: string;
  skus: ProductSkuInput[];
};

export type UpdatePackagedProductRequest = {
  name?: string;
  categoryId?: string;
  description?: string | null;
  image?: string | null;
  isActive?: boolean;
  skus?: ProductSkuInput[];
};

export type CreatePackagedProductResponse = { product: PackagedProductObject };
export type UpdatePackagedProductResponse = { product: PackagedProductObject };
export type UpdateProductStockRequest = { skuId: string; stock: number };
export type UpdateProductStockResponse = { product: PackagedProductObject };

export type { EProductType };
