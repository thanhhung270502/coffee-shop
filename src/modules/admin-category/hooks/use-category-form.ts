"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import type { CategoryObject, EProductType } from "@common/models/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "@/shared/mutations/use-admin-category-mutations";

export const categoryFormSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  sortOrder: z.number().int().min(0, "Sort order must be at least 0"),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;

const defaultValues: CategoryFormData = { name: "", sortOrder: 0 };

export const useCategoryForm = (activeType: EProductType) => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryObject | null>(null);

  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();

  const methods = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues,
  });

  const openCreate = useCallback(() => {
    setEditing(null);
    methods.reset(defaultValues);
    setOpen(true);
  }, [methods]);

  const openEdit = useCallback(
    (category: CategoryObject) => {
      setEditing(category);
      methods.reset({ name: category.name, sortOrder: category.sortOrder });
      setOpen(true);
    },
    [methods],
  );

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen);
      if (!isOpen) {
        setEditing(null);
        methods.reset(defaultValues);
      }
    },
    [methods],
  );

  const onSubmit = methods.handleSubmit(async (values) => {
    if (editing) {
      await updateMutation.mutateAsync({
        id: editing.id,
        data: { name: values.name, sortOrder: values.sortOrder },
      });
    } else {
      await createMutation.mutateAsync({
        name: values.name,
        type: activeType,
        sortOrder: values.sortOrder,
      });
    }
    setOpen(false);
    setEditing(null);
    methods.reset(defaultValues);
  });

  return {
    open,
    setOpen: handleOpenChange,
    openCreate,
    openEdit,
    editing,
    methods,
    onSubmit,
    isSubmitting: methods.formState.isSubmitting,
  };
};

export type UseCategoryFormReturn = ReturnType<typeof useCategoryForm>;
