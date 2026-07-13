import { z } from "zod";

const variantSchema = z.object({
  name: z.string().min(1),
  price: z.number().int().min(0),
});

const skuSchema = z.object({
  label: z.string().min(1),
  sku: z.string().optional(),
  price: z.number().int().min(0),
  stock: z.number().int().min(0).optional(),
});

export const listDrinksSchema = z.object({
  limit: z.number().int().min(1).max(100),
  offset: z.number().int().min(0),
  search: z.string().optional(),
  categoryId: z.string().optional(),
});

export const listPackagedProductsSchema = z.object({
  limit: z.number().int().min(1).max(100),
  offset: z.number().int().min(0),
  search: z.string().optional(),
  categoryId: z.string().optional(),
});

export const createDrinkSchema = z.object({
  name: z.string().min(1),
  categoryId: z.string().min(1),
  description: z.string().optional(),
  image: z.string().url().optional().or(z.literal("")),
  variants: z.array(variantSchema).min(1),
  toppingIds: z.array(z.string()).optional(),
});

export const updateDrinkSchema = z.object({
  name: z.string().min(1).optional(),
  categoryId: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  variants: z.array(variantSchema).min(1).optional(),
  toppingIds: z.array(z.string()).optional(),
});

export const updateDrinkStatusSchema = z.object({
  isActive: z.boolean(),
});

export const createPackagedProductSchema = z.object({
  name: z.string().min(1),
  categoryId: z.string().min(1),
  description: z.string().optional(),
  image: z.string().url().optional().or(z.literal("")),
  skus: z.array(skuSchema).min(1),
});

export const updatePackagedProductSchema = z.object({
  name: z.string().min(1).optional(),
  categoryId: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  skus: z.array(skuSchema).min(1).optional(),
});

export const updateProductStockSchema = z.object({
  skuId: z.string().min(1),
  stock: z.number().int().min(0),
});

export type ListDrinksInput = z.infer<typeof listDrinksSchema>;
export type ListPackagedProductsInput = z.infer<typeof listPackagedProductsSchema>;
export type CreateDrinkInput = z.infer<typeof createDrinkSchema>;
export type UpdateDrinkInput = z.infer<typeof updateDrinkSchema>;
export type CreatePackagedProductInput = z.infer<typeof createPackagedProductSchema>;
export type UpdatePackagedProductInput = z.infer<typeof updatePackagedProductSchema>;
export type UpdateProductStockInput = z.infer<typeof updateProductStockSchema>;
