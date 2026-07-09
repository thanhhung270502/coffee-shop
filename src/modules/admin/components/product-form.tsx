"use client";

import { useFieldArray } from "react-hook-form";

import { Button } from "@/shared/components/button";
import { DialogClose, DialogTitle } from "@/shared/components/dialog";
import { RHFInput } from "@/shared/components/react-hook-form/RHFInput";
import { RHFSelect } from "@/shared/components/react-hook-form/RHFSelect";
import { RHFTextarea } from "@/shared/components/react-hook-form/RHFTextarea";
import { FormProvider } from "@/shared/providers";

import type { UseProductFormReturn } from "../hooks/use-product-form";

type ProductFormProps = Pick<
  UseProductFormReturn,
  "methods" | "onSubmit" | "isSubmitting" | "editing" | "categoryOptions"
>;

export const ProductForm = ({
  methods,
  onSubmit,
  isSubmitting,
  editing,
  categoryOptions,
}: ProductFormProps) => {
  const { fields } = useFieldArray({
    control: methods.control,
    name: "skus",
  });

  return (
    <FormProvider
      formMethods={methods}
      onSubmit={onSubmit}
      className="flex max-h-[80vh] flex-col gap-4 overflow-y-auto"
    >
      <DialogTitle>{editing ? "Edit Product" : "Add Product"}</DialogTitle>
      <RHFInput name="name" control={methods.control} label="Name" required />
      <RHFSelect
        name="categoryId"
        control={methods.control}
        label="Category"
        options={categoryOptions}
        placeholder="Select category"
        required
      />
      <RHFTextarea name="description" control={methods.control} label="Description" />
      <RHFInput name="image" control={methods.control} label="Image (URL)" />
      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-2 gap-2">
          <RHFInput
            name={`skus.${index}.label`}
            control={methods.control}
            placeholder="Label (250g)"
          />
          <RHFInput
            name={`skus.${index}.sku`}
            control={methods.control}
            placeholder="SKU code"
          />
          <RHFInput
            name={`skus.${index}.price`}
            control={methods.control}
            placeholder="Price"
            type="number"
          />
          <RHFInput
            name={`skus.${index}.stock`}
            control={methods.control}
            placeholder="Stock"
            type="number"
          />
        </div>
      ))}
      <div className="flex justify-end gap-2">
        <DialogClose
          render={
            <Button type="button" variant="secondary-gray" size="sm">
              Cancel
            </Button>
          }
        />
        <Button type="submit" variant="primary" size="sm" loading={isSubmitting}>
          {editing ? "Update" : "Create"}
        </Button>
      </div>
    </FormProvider>
  );
};
