"use client";

import { Add } from "iconsax-reactjs";

import { Button } from "@/shared/components/button";
import { Dialog, DialogContent, DialogTrigger } from "@/shared/components/dialog";

import type { UseDrinkFormReturn } from "../hooks/use-drink-form";

import { DrinkForm } from "./drink-form";

type DrinkFormDialogProps = UseDrinkFormReturn;

export const DrinkFormDialog = ({
  open,
  setOpen,
  openCreate,
  editing,
  methods,
  onSubmit,
  isSubmitting,
  categoryOptions,
  toppingItems,
  toppings,
}: DrinkFormDialogProps) => (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger
      render={
        <Button variant="primary" size="sm" startIcon={Add} onClick={openCreate}>
          Add Drink
        </Button>
      }
    />
    <DialogContent className="w-full! max-w-lg">
      <div className="p-6">
        <DrinkForm
          methods={methods}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          editing={editing}
          categoryOptions={categoryOptions}
          toppingItems={toppingItems}
          toppings={toppings}
        />
      </div>
    </DialogContent>
  </Dialog>
);
