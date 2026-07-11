import type { EProductType } from "../category/category-model";

export type PublicCategoryObject = {
  id: string;
  name: string;
  slug: string;
  type: EProductType;
  sortOrder: number;
};

export type PublicVariantObject = {
  id: string;
  name: string;
  price: number;
};

export type PublicToppingObject = {
  id: string;
  name: string;
  price: number;
};

export type PublicSkuObject = {
  id: string;
  label: string;
  sku: string | null;
  price: number;
  stock: number;
};

export type PublicDrinkObject = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  variants: PublicVariantObject[];
  toppings: PublicToppingObject[];
  minPrice: number;
};

export type PublicProductObject = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  skus: PublicSkuObject[];
  minPrice: number;
  inStock: boolean;
};

export type ListPublicCategoriesResponse = {
  categories: PublicCategoryObject[];
};

export type ListPublicDrinksResponse = {
  drinks: PublicDrinkObject[];
};

export type GetPublicDrinkResponse = {
  drink: PublicDrinkObject;
};

export type ListPublicProductsResponse = {
  products: PublicProductObject[];
};

export type GetPublicProductResponse = {
  product: PublicProductObject;
};

export type { EProductType };
