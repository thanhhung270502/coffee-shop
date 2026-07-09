"use client";

import { Button } from "@/shared/components/button";
import { DialogClose, DialogTitle } from "@/shared/components/dialog";
import { RHFInput } from "@/shared/components/react-hook-form/RHFInput";
import { FormProvider } from "@/shared/providers";

import type { UseCategoryFormReturn } from "../hooks/use-category-form";

type CategoryFormProps = Pick<
  UseCategoryFormReturn,
  "methods" | "onSubmit" | "isSubmitting" | "editing"
>;

export const CategoryForm = ({ methods, onSubmit, isSubmitting, editing }: CategoryFormProps) => (
  <FormProvider formMethods={methods} onSubmit={onSubmit} className="flex flex-col gap-4">
    <DialogTitle>{editing ? "Edit Category" : "Add Category"}</DialogTitle>
    <RHFInput
      name="name"
      control={methods.control}
      label="Category Name"
      required
    />
    <RHFInput
      name="sortOrder"
      control={methods.control}
      label="Sort Order"
      type="number"
    />
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
