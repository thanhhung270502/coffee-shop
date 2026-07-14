import { z } from "zod";

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "READY",
    "COMPLETED",
    "CANCELLED",
  ]),
});

export const drinkOrderItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  variantId: z.string().min(1, "Variant is required"),
  toppingIds: z.array(z.string()).optional(),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  note: z.string().optional(),
  options: z
    .object({
      sugar: z.string().optional(),
      ice: z.string().optional(),
    })
    .optional(),
});

export const createDrinkOrderSchema = z
  .object({
    customerName: z.string().min(1, "Name is required"),
    customerPhone: z.string().min(1, "Phone is required"),
    fulfillment: z.enum(["DELIVERY", "PICKUP"]),
    deliveryAddress: z.string().optional(),
    note: z.string().optional(),
    paymentMethod: z.enum(["COD", "BANK_TRANSFER", "CASH", "MOMO"]),
    items: z.array(drinkOrderItemSchema).min(1, "At least one item is required"),
  })
  .superRefine((data, ctx) => {
    if (data.fulfillment === "DELIVERY" && !data.deliveryAddress?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Delivery address is required",
        path: ["deliveryAddress"],
      });
    }
  });

export const productOrderItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  skuId: z.string().min(1, "SKU is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export const createProductOrderSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  customerPhone: z.string().min(1, "Phone is required"),
  shippingAddress: z.string().min(1, "Shipping address is required"),
  note: z.string().optional(),
  paymentMethod: z.enum(["COD", "BANK_TRANSFER", "CASH", "MOMO"]),
  items: z.array(productOrderItemSchema).min(1, "At least one item is required"),
});

export const posOrderItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  variantId: z.string().min(1, "Variant is required"),
  toppingIds: z.array(z.string()).optional(),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  note: z.string().optional(),
  options: z
    .object({
      sugar: z.string().optional(),
      ice: z.string().optional(),
    })
    .optional(),
});

export const createPosOrderSchema = z.object({
  customerName: z.string().optional(),
  note: z.string().optional(),
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER"]),
  paymentReference: z.string().optional(),
  shippingFee: z.number().int().min(0, "Shipping fee cannot be negative").optional(),
  discount: z.number().int().min(0, "Discount cannot be negative").optional(),
  taxRate: z.number().int().min(0, "Tax rate cannot be negative").max(100, "Tax rate cannot exceed 100%").optional(),
  items: z.array(posOrderItemSchema).min(1, "At least one item is required"),
});

export const listOrdersSchema = z.object({
  limit: z.number().int().min(1, "Limit must be at least 1").max(100, "Limit cannot exceed 100"),
  offset: z.number().int().min(0, "Offset must be at least 0"),
  search: z.string().optional(),
  types: z.array(z.enum(["DRINK_ORDER", "PRODUCT_ORDER"])).optional(),
  statuses: z
    .array(z.enum(["PENDING", "CONFIRMED", "PREPARING", "READY", "COMPLETED", "CANCELLED"]))
    .optional(),
  channels: z.array(z.enum(["ONLINE", "POS"])).optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type ListOrdersInput = z.infer<typeof listOrdersSchema>;
export type CreateDrinkOrderInput = z.infer<typeof createDrinkOrderSchema>;
export type CreateProductOrderInput = z.infer<typeof createProductOrderSchema>;
export type CreatePosOrderInput = z.infer<typeof createPosOrderSchema>;
