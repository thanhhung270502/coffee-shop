import { z } from "zod";

export const updateSettingsSchema = z.object({
  shopName: z.string().min(1).optional(),
  address: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  openTime: z.string().nullable().optional(),
  closeTime: z.string().nullable().optional(),
  baseShipping: z.number().int().min(0).optional(),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
