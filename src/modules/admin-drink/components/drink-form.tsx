"use client";

import { useFieldArray } from "react-hook-form";

import { Button } from "@/shared/components/button";
import { DialogClose, DialogTitle } from "@/shared/components/dialog";
import { RHFCheckboxGroup } from "@/shared/components/react-hook-form/RHFCheckboxGroup";
import { RHFInput } from "@/shared/components/react-hook-form/RHFInput";
import { RHFSelect } from "@/shared/components/react-hook-form/RHFSelect";
import { RHFTextarea } from "@/shared/components/react-hook-form/RHFTextarea";
import { Typography } from "@/shared/components/typography";
import { FormProvider } from "@/shared/providers";
import { formatCurrency } from "@/shared/utils/currency.util";

import type { UseDrinkFormReturn } from "../hooks/use-drink-form";

type DrinkFormProps = Pick<
  UseDrinkFormReturn,
  | "methods"
  | "onSubmit"
  | "isSubmitting"
  | "editing"
  | "categoryOptions"
  | "toppingItems"
  | "toppings"
>;

export const DrinkForm = ({
  methods,
  onSubmit,
  isSubmitting,
  editing,
  categoryOptions,
  toppingItems,
  toppings,
}: DrinkFormProps) => {
  const { fields } = useFieldArray({
    control: methods.control,
    name: "variants",
  });

  const toppingCheckboxItems = toppingItems.map((item) => {
    const topping = toppings.find((t) => t.id === item.value);
    const priceLabel = topping ? ` (+${formatCurrency(topping.price)})` : "";
    return {
      label: `${item.label}${priceLabel}`,
      value: item.value,
    };
  });

  return (
    <FormProvider
      formMethods={methods}
      onSubmit={onSubmit}
      className="flex max-h-[80vh] flex-col gap-4 overflow-y-auto"
    >
      <DialogTitle>{editing ? "Edit Drink" : "Add Drink"}</DialogTitle>
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
      <div>
        <Typography variant="body-sm" weight="semibold" className="mb-2">
          Size & Price
        </Typography>
        {fields.map((field, index) => (
          <div key={field.id} className="mb-2 flex gap-2">
            <RHFInput
              name={`variants.${index}.name`}
              control={methods.control}
              placeholder="Size"
            />
            <RHFInput
              name={`variants.${index}.price`}
              control={methods.control}
              placeholder="Price"
              type="number"
            />
          </div>
        ))}
      </div>
      {toppingCheckboxItems.length > 0 && (
        <RHFCheckboxGroup
          name="toppingIds"
          control={methods.control}
          items={toppingCheckboxItems}
          label="Toppings"
          columns={1}
          wrapperClassName="flex flex-wrap gap-2"
          itemClassName="bg-transparent border-0 hover:bg-transparent px-0 py-0"
        />
      )}
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
