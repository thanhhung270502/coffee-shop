"use client";

import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useCreateToppingMutation } from "@/shared/mutations/use-admin-topping-mutations";

export const toppingFormSchema = z.object({
  name: z.string().min(1, "Topping name is required"),
  price: z.number().min(0, "Price must be at least 0"),
});

export type ToppingFormData = z.infer<typeof toppingFormSchema>;

const defaultValues: ToppingFormData = { name: "", price: 0 };

export const useToppingForm = () => {
  const createMutation = useCreateToppingMutation();

  const methods = useForm<ToppingFormData>({
    resolver: zodResolver(toppingFormSchema),
    defaultValues,
  });

  const onSubmit = methods.handleSubmit(async (values) => {
    await createMutation.mutateAsync({
      name: values.name,
      price: values.price,
    });
    methods.reset(defaultValues);
  });

  const reset = useCallback(() => {
    methods.reset(defaultValues);
  }, [methods]);

  return {
    methods,
    onSubmit,
    reset,
    isSubmitting: methods.formState.isSubmitting,
  };
};

export type UseToppingFormReturn = ReturnType<typeof useToppingForm>;
