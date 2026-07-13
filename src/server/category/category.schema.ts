import { z } from "zod";

export const listCategoriesSchema = z.object({
  limit: z.number().int().min(1).max(100),
  offset: z.number().int().min(0),
  type: z.enum(["DRINK", "PACKAGED"]).optional(),
  search: z.string().optional(),
});

export type ListCategoriesInput = z.infer<typeof listCategoriesSchema>;

export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  type: z.enum(["DRINK", "PACKAGED"]),
  sortOrder: z.number().int().min(0).optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
