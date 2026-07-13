"use client";

import { Button } from "@/shared/components/button";
import { RHFInput } from "@/shared/components/react-hook-form/RHFInput";
import { FormProvider } from "@/shared/providers";

import type { UseToppingFormReturn } from "../hooks/use-topping-form";

type ToppingFormProps = Pick<UseToppingFormReturn, "methods" | "onSubmit" | "isSubmitting">;

export const ToppingForm = ({ methods, onSubmit, isSubmitting }: ToppingFormProps) => (
  <FormProvider formMethods={methods} onSubmit={onSubmit} className="mb-3 flex gap-2">
    <RHFInput
      name="name"
      control={methods.control}
      placeholder="Topping name"
      showError={false}
      size="sm"
    />
    <RHFInput
      name="price"
      control={methods.control}
      placeholder="Price"
      type="number"
      showError={false}
      size="sm"
    />
    <Button type="submit" variant="primary" size="sm" loading={isSubmitting}>
      Add
    </Button>
  </FormProvider>
);
