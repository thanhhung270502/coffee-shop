"use client";

import type { DrinkObject } from "@common/models/product";
import { Edit2 } from "iconsax-reactjs";

import { Button } from "@/shared/components/button";
import { Typography } from "@/shared/components/typography";
import { formatCurrency } from "@/shared/utils/currency.util";

import type { UseDrinkFormReturn } from "../hooks/use-drink-form";

import { DrinkStatus } from "./drink-status";

type DrinkItemMobileProps = {
  drink: DrinkObject;
  openEdit: UseDrinkFormReturn["openEdit"];
  onToggleStatus: (drink: DrinkObject) => void;
  isTogglingStatus: boolean;
};

export const DrinkItemMobile = ({
  drink,
  openEdit,
  onToggleStatus,
  isTogglingStatus,
}: DrinkItemMobileProps) => {
  const minPrice = drink.variants.length
    ? Math.min(...drink.variants.map((v) => v.price))
    : 0;

  return (
    <div className="gap-md p-lg flex flex-col rounded-xl border border-gray-200 bg-white">
      <div className="flex items-start justify-between">
        <div className="gap-xs flex flex-col">
          <Typography variant="body-sm" className="font-medium">
            {drink.name}
          </Typography>
          <Typography variant="body-xs" color="secondary">
            {drink.categoryName}
          </Typography>
        </div>
        <DrinkStatus drink={drink} />
      </div>
      <div className="flex items-center justify-between">
        <Typography variant="body-xs" color="secondary">
          From {formatCurrency(minPrice)}
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="tertiary-gray"
            size="xs"
            startIcon={Edit2}
            onClick={() => openEdit(drink)}
          >
            Edit
          </Button>
          <Button
            variant="secondary-gray"
            size="xs"
            onClick={() => onToggleStatus(drink)}
            disabled={isTogglingStatus}
          >
            {drink.isActive ? "Disable" : "Enable"}
          </Button>
        </div>
      </div>
    </div>
  );
};
