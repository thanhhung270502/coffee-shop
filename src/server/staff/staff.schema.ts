import { z } from "zod";

export const listStaffSchema = z.object({
  limit: z.number().int().min(1).max(100),
  offset: z.number().int().min(0),
  search: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const createStaffSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().optional(),
  phone: z.string().optional(),
});

export const updateStaffSchema = z.object({
  name: z.string().optional(),
  phone: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

export const resetStaffPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type ListStaffInput = z.infer<typeof listStaffSchema>;
export type CreateStaffInput = z.infer<typeof createStaffSchema>;
export type UpdateStaffInput = z.infer<typeof updateStaffSchema>;
export type ResetStaffPasswordInput = z.infer<typeof resetStaffPasswordSchema>;
