"use client";

import { useForm } from "react-hook-form";
import { EFulfillmentType, EPaymentMethod } from "@common/models/order";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { useCreateDrinkOrderMutation } from "@/shared/mutations";

import { useDrinkCart } from "./use-drink-cart";

export const drinkCheckoutSchema = z
  .object({
    customerName: z.string().min(1, "Name is required"),
    customerPhone: z.string().min(1, "Phone is required"),
    fulfillment: z.nativeEnum(EFulfillmentType),
    deliveryAddress: z.string().optional(),
    note: z.string().optional(),
    paymentMethod: z.nativeEnum(EPaymentMethod),
  })
  .superRefine((data, ctx) => {
    if (data.fulfillment === EFulfillmentType.DELIVERY && !data.deliveryAddress?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Delivery address is required",
        path: ["deliveryAddress"],
      });
    }
  });

export type DrinkCheckoutFormData = z.infer<typeof drinkCheckoutSchema>;

export function useDrinkCheckout() {
  const router = useRouter();
  const { items, clearCart } = useDrinkCart();
  const createOrder = useCreateDrinkOrderMutation();

  const methods = useForm<DrinkCheckoutFormData>({
    resolver: zodResolver(drinkCheckoutSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      fulfillment: EFulfillmentType.PICKUP,
      deliveryAddress: "",
      note: "",
      paymentMethod: EPaymentMethod.COD,
    },
  });

  const onSubmit = methods.handleSubmit(async (values) => {
    if (items.length === 0) return;

    const result = await createOrder.mutateAsync({
      customerName: values.customerName,
      customerPhone: values.customerPhone,
      fulfillment: values.fulfillment,
      deliveryAddress: values.deliveryAddress,
      note: values.note,
      paymentMethod: values.paymentMethod,
      items: items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        toppingIds: item.toppingIds,
        quantity: item.quantity,
        note: item.note || undefined,
        options: {
          sugar: item.sugar,
          ice: item.ice,
        },
      })),
    });

    clearCart();
    router.push(`/orders/${result.order.id}?phone=${encodeURIComponent(values.customerPhone)}`);
  });

  return {
    methods,
    onSubmit,
    isSubmitting: methods.formState.isSubmitting || createOrder.isPending,
    items,
  };
}

export type UseDrinkCheckoutReturn = ReturnType<typeof useDrinkCheckout>;
