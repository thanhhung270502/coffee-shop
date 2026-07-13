"use client";

import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { EProductType } from "@common/models/category";
import type { DrinkObject } from "@common/models/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  useCreateDrinkMutation,
  useUpdateDrinkMutation,
} from "@/shared/mutations/use-admin-drink-mutations";
import { useQueryAdminCategories } from "@/shared/queries/use-query-admin-categories";
import { useQueryAdminToppings } from "@/shared/queries/use-query-admin-toppings";

const variantFormSchema = z.object({
  name: z.string().min(1, "Size name is required"),
  price: z.number().min(0, "Price must be at least 0"),
});

export const drinkFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string(),
  image: z.string(),
  variants: z.array(variantFormSchema).min(1, "At least one variant is required"),
  toppingIds: z.array(z.string()),
});

export type DrinkFormData = z.infer<typeof drinkFormSchema>;

export const defaultDrinkVariants: DrinkFormData["variants"] = [
  { name: "S", price: 25000 },
  { name: "M", price: 30000 },
  { name: "L", price: 35000 },
];

const defaultValues: DrinkFormData = {
  name: "",
  categoryId: "",
  description: "",
  image: "",
  variants: defaultDrinkVariants,
  toppingIds: [],
};

export const useDrinkForm = () => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DrinkObject | null>(null);
  const defaultCategoryIdRef = useRef("");

  const { data: categoriesData } = useQueryAdminCategories({
    input: { type: EProductType.DRINK, limit: 100, offset: 0 },
  });
  const { data: toppingsData } = useQueryAdminToppings();
  const createMutation = useCreateDrinkMutation();
  const updateMutation = useUpdateDrinkMutation();

  const categories = categoriesData?.data ?? [];
  const toppings = toppingsData?.toppings ?? [];
  defaultCategoryIdRef.current = categories[0]?.id ?? "";

  const methods = useForm<DrinkFormData>({
    resolver: zodResolver(drinkFormSchema),
    defaultValues,
  });

  const openCreate = useCallback(() => {
    setEditing(null);
    methods.reset({
      ...defaultValues,
      categoryId: defaultCategoryIdRef.current,
    });
    setOpen(true);
  }, [methods]);

  const openEdit = useCallback(
    (drink: DrinkObject) => {
      setEditing(drink);
      methods.reset({
        name: drink.name,
        categoryId: drink.categoryId,
        description: drink.description ?? "",
        image: drink.image ?? "",
        variants: drink.variants.map((v) => ({ name: v.name, price: v.price })),
        toppingIds: drink.toppings.map((t) => t.id),
      });
      setOpen(true);
    },
    [methods],
  );

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen);
      if (!isOpen) {
        setEditing(null);
        methods.reset({
          ...defaultValues,
          categoryId: defaultCategoryIdRef.current,
        });
      }
    },
    [methods],
  );

  const onSubmit = methods.handleSubmit(async (values) => {
    const payload = {
      name: values.name,
      categoryId: values.categoryId,
      description: values.description || undefined,
      image: values.image || undefined,
      variants: values.variants,
      toppingIds: values.toppingIds,
    };

    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setOpen(false);
    setEditing(null);
    methods.reset({
      ...defaultValues,
      categoryId: defaultCategoryIdRef.current,
    });
  });

  const categoryOptions = categories.map((c) => ({ label: c.name, value: c.id }));
  const toppingItems = toppings.map((t) => ({ label: t.name, value: t.id }));

  return {
    open,
    setOpen: handleOpenChange,
    openCreate,
    openEdit,
    editing,
    methods,
    onSubmit,
    isSubmitting: methods.formState.isSubmitting,
    categoryOptions,
    toppingItems,
    toppings,
  };
};

export type UseDrinkFormReturn = ReturnType<typeof useDrinkForm>;
