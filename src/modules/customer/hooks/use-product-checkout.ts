"use client";

import { useForm } from "react-hook-form";
import { EPaymentMethod } from "@common/models/order";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { useCreateProductOrderMutation } from "@/shared/mutations";

import { useProductCart } from "./use-product-cart";

export const productCheckoutSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  customerPhone: z.string().min(1, "Phone is required"),
  shippingAddress: z.string().min(1, "Shipping address is required"),
  note: z.string().optional(),
  paymentMethod: z.nativeEnum(EPaymentMethod),
});

export type ProductCheckoutFormData = z.infer<typeof productCheckoutSchema>;

export function useProductCheckout() {
  const router = useRouter();
  const { items, clearCart } = useProductCart();
  const createOrder = useCreateProductOrderMutation();

  const methods = useForm<ProductCheckoutFormData>({
    resolver: zodResolver(productCheckoutSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      shippingAddress: "",
      note: "",
      paymentMethod: EPaymentMethod.COD,
    },
  });

  const onSubmit = methods.handleSubmit(async (values) => {
    if (items.length === 0) return;

    const result = await createOrder.mutateAsync({
      customerName: values.customerName,
      customerPhone: values.customerPhone,
      shippingAddress: values.shippingAddress,
      note: values.note,
      paymentMethod: values.paymentMethod,
      items: items.map((item) => ({
        productId: item.productId,
        skuId: item.skuId,
        quantity: item.quantity,
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

export type UseProductCheckoutReturn = ReturnType<typeof useProductCheckout>;
