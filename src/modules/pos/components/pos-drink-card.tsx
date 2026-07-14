"use client";

import type { PublicDrinkObject } from "@common/models/catalog";
import Image from "next/image";

import { Badge, Typography } from "@/shared/components";
import { formatCurrency } from "@/shared/utils/currency.util";

type PosDrinkCardProps = {
  drink: PublicDrinkObject;
  onSelect: (drink: PublicDrinkObject) => void;
};

export function PosDrinkCard({ drink, onSelect }: PosDrinkCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(drink)}
      className="flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white text-left shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
    >
      <div className="p-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-100">
          {drink.image ? (
            <Image
              src={drink.image}
              alt={drink.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 20vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-4xl" aria-hidden>
                ☕
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 px-3 pb-3">
        <Typography variant="body-xs" color="secondary" className="truncate">
          {drink.categoryName}
        </Typography>
        <Typography variant="body-sm" className="line-clamp-2 font-semibold leading-tight">
          {drink.name}
        </Typography>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <Badge variant="success">Available</Badge>
          <Typography variant="body-sm" className="font-semibold text-success-600">
            {formatCurrency(drink.minPrice)}
          </Typography>
        </div>
      </div>
    </button>
  );
}
