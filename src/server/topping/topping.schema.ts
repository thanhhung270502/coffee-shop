import { z } from "zod";

export const createToppingSchema = z.object({
  name: z.string().min(1, "Topping name is required"),
  price: z.number().int().min(0),
  isActive: z.boolean().optional(),
});

export const updateToppingSchema = z.object({
  name: z.string().min(1).optional(),
  price: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export type CreateToppingInput = z.infer<typeof createToppingSchema>;
export type UpdateToppingInput = z.infer<typeof updateToppingSchema>;
