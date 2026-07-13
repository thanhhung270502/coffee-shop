"use client";

import { Add } from "iconsax-reactjs";

import { Button } from "@/shared/components/button";
import { Dialog, DialogContent, DialogTrigger } from "@/shared/components/dialog";

import type { UseCategoryFormReturn } from "../hooks/use-category-form";

import { CategoryForm } from "./category-form";

type CategoryFormDialogProps = UseCategoryFormReturn;

export const CategoryFormDialog = ({
  open,
  setOpen,
  openCreate,
  editing,
  methods,
  onSubmit,
  isSubmitting,
}: CategoryFormDialogProps) => (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger
      render={
        <Button variant="primary" size="sm" startIcon={Add} onClick={openCreate}>
          Add Category
        </Button>
      }
    />
    <DialogContent className="w-full! max-w-md">
      <div className="p-6">
        <CategoryForm
          methods={methods}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          editing={editing}
        />
      </div>
    </DialogContent>
  </Dialog>
);
