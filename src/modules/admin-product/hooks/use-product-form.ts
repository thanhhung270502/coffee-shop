"use client";

import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { EProductType } from "@common/models/category";
import type { PackagedProductObject } from "@common/models/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/shared/mutations/use-admin-product-mutations";
import { useQueryAdminCategories } from "@/shared/queries/use-query-admin-categories";

const skuFormSchema = z.object({
  label: z.string().min(1, "Label is required"),
  sku: z.string(),
  price: z.number().min(0, "Price must be at least 0"),
  stock: z.number().int().min(0, "Stock must be at least 0"),
});

export const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string(),
  image: z.string(),
  skus: z.array(skuFormSchema).min(1, "At least one SKU is required"),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

export const defaultProductSkus: ProductFormData["skus"] = [
  { label: "250g", sku: "", price: 150000, stock: 10 },
];

const defaultValues: ProductFormData = {
  name: "",
  categoryId: "",
  description: "",
  image: "",
  skus: defaultProductSkus,
};

export const useProductForm = () => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PackagedProductObject | null>(null);
  const defaultCategoryIdRef = useRef("");

  const { data: categoriesData } = useQueryAdminCategories({
    input: { type: EProductType.PACKAGED, limit: 100, offset: 0 },
  });
  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();

  const categories = categoriesData?.data ?? [];
  defaultCategoryIdRef.current = categories[0]?.id ?? "";

  const methods = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
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
    (product: PackagedProductObject) => {
      setEditing(product);
      methods.reset({
        name: product.name,
        categoryId: product.categoryId,
        description: product.description ?? "",
        image: product.image ?? "",
        skus: product.skus.map((s) => ({
          label: s.label,
          sku: s.sku ?? "",
          price: s.price,
          stock: s.stock,
        })),
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
      skus: values.skus.map((s) => ({
        label: s.label,
        sku: s.sku || undefined,
        price: s.price,
        stock: s.stock,
      })),
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
  };
};

export type UseProductFormReturn = ReturnType<typeof useProductForm>;
