"use client";

import type { PublicDrinkObject } from "@common/models/catalog";
import { Coffee } from "iconsax-reactjs";

import { Card, CardContent, Typography } from "@/shared/components";
import { formatCurrency } from "@/shared/utils/currency.util";

type DrinkCardProps = {
  drink: PublicDrinkObject;
  onSelect: (drink: PublicDrinkObject) => void;
};

export function DrinkCard({ drink, onSelect }: DrinkCardProps) {
  return (
    <button type="button" onClick={() => onSelect(drink)} className="w-full text-left">
      <Card className="h-full overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md">
        <div className="aspect-4/3 overflow-hidden bg-zinc-100">
          {drink.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={drink.image}
              alt={drink.name}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-zinc-300">
              <Coffee size={32} variant="Bold" />
            </div>
          )}
        </div>
        <CardContent className="space-y-1">
          <Typography variant="heading-sm" className="line-clamp-1">
            {drink.name}
          </Typography>
          {drink.description ? (
            <Typography variant="body-xs" color="secondary" className="line-clamp-1">
              {drink.description}
            </Typography>
          ) : null}
          <Typography variant="body-sm" color="secondary">
            From {formatCurrency(drink.minPrice)}
          </Typography>
        </CardContent>
      </Card>
    </button>
  );
}
