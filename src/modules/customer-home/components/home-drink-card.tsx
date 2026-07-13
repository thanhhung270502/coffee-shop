"use client";

import type { PublicDrinkObject } from "@common/models/catalog";
import { Coffee } from "iconsax-reactjs";
import Link from "next/link";

import { Button, Card, CardContent, Typography } from "@/shared/components";
import { formatCurrency } from "@/shared/utils/currency.util";

type HomeDrinkCardProps = {
  drink: PublicDrinkObject;
};

export const HomeDrinkCard = ({ drink }: HomeDrinkCardProps) => {
  return (
    <Card className="flex h-full w-[240px] shrink-0 snap-start flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md md:w-auto">
      <div className="aspect-4/3 overflow-hidden bg-zinc-100">
        {drink.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={drink.image}
            alt={drink.name}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-300">
            <Coffee size={32} variant="Bold" />
          </div>
        )}
      </div>
      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        <Typography variant="heading-sm" className="line-clamp-1">
          {drink.name}
        </Typography>
        {drink.description ? (
          <Typography variant="body-xs" color="secondary" className="line-clamp-2">
            {drink.description}
          </Typography>
        ) : null}
        <Typography variant="body-sm" className="text-brand-main font-medium">
          From {formatCurrency(drink.minPrice)}
        </Typography>
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <Link href="/order">
            <Button variant="link" size="sm">
              View details
            </Button>
          </Link>
          <Link href="/order">
            <Button variant="primary" size="sm">
              Order now
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
