"use client";

import type { PublicDrinkObject } from "@common/models/catalog";
import Image from "next/image";

import { Typography } from "@/shared/components/typography";
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
      className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-95"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-amber-50">
        {drink.image ? (
          <Image
            src={drink.image}
            alt={drink.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-4xl">☕</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <Typography variant="body-sm" className="line-clamp-2 font-semibold leading-tight">
          {drink.name}
        </Typography>
        <Typography variant="body-xs" color="secondary">
          From {formatCurrency(drink.minPrice)}
        </Typography>
      </div>
    </button>
  );
}
