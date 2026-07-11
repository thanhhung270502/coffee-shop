"use client";

import type { PublicDrinkObject } from "@common/models/catalog";

import { Card, CardContent, Typography } from "@/shared/components";
import { formatCurrency } from "@/shared/utils/currency.util";

type DrinkCardProps = {
  drink: PublicDrinkObject;
  onSelect: (drink: PublicDrinkObject) => void;
};

export function DrinkCard({ drink, onSelect }: DrinkCardProps) {
  return (
    <button type="button" onClick={() => onSelect(drink)} className="text-left">
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        <div className="aspect-[4/3] bg-zinc-100">
          {drink.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={drink.image} alt={drink.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-400">No image</div>
          )}
        </div>
        <CardContent className="space-y-1">
          <Typography variant="heading-sm">{drink.name}</Typography>
          <Typography variant="body-sm" color="secondary">
            From {formatCurrency(drink.minPrice)}
          </Typography>
        </CardContent>
      </Card>
    </button>
  );
}
