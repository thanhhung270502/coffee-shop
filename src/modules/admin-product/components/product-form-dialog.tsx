"use client";

import { Add } from "iconsax-reactjs";

import { Button } from "@/shared/components/button";
import { Dialog, DialogContent, DialogTrigger } from "@/shared/components/dialog";

import type { UseProductFormReturn } from "../hooks/use-product-form";

import { ProductForm } from "./product-form";

type ProductFormDialogProps = UseProductFormReturn;

export const ProductFormDialog = ({
  open,
  setOpen,
  openCreate,
  editing,
  methods,
  onSubmit,
  isSubmitting,
  categoryOptions,
}: ProductFormDialogProps) => (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger
      render={
        <Button variant="primary" size="sm" startIcon={Add} onClick={openCreate}>
          Add Product
        </Button>
      }
    />
    <DialogContent className="w-full! max-w-lg">
      <div className="p-6">
        <ProductForm
          methods={methods}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          editing={editing}
          categoryOptions={categoryOptions}
        />
      </div>
    </DialogContent>
  </Dialog>
);
