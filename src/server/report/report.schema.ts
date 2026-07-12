import { z } from "zod";

export const revenueQuerySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  groupBy: z.enum(["day", "week", "month"]).optional().default("day"),
});

export const topProductsQuerySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
});

export const exportOrdersQuerySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
});

export type RevenueQueryInput = z.infer<typeof revenueQuerySchema>;
export type TopProductsQueryInput = z.infer<typeof topProductsQuerySchema>;
export type ExportOrdersQueryInput = z.infer<typeof exportOrdersQuerySchema>;
