import Link from "next/link";

import { Card, CardContent, Typography } from "@/shared/components";

import type { HomePromoCard } from "../constants";

type HomePromoGridProps = {
  cards: HomePromoCard[];
};

export const HomePromoGrid = ({ cards }: HomePromoGridProps) => {
  if (cards.length === 0) return null;

  return (
    <section aria-label="Featured promotions">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2">
        {cards.map((card) => (
          <Link
            key={card.id}
            href={card.href}
            className={`group block ${card.className ?? ""}`}
          >
            <Card className="relative h-full min-h-[180px] overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md md:min-h-[200px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
              <CardContent className="relative flex h-full flex-col justify-end gap-1 p-4 md:p-6">
                <Typography variant="heading-sm" className="text-white">
                  {card.title}
                </Typography>
                <Typography variant="body-sm" className="text-white/85">
                  {card.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};
