import Link from "next/link";

import { Card, CardContent, Typography } from "@/shared/components";

import type { HomeMosaicTile } from "../constants";

import { HomeSectionHeader } from "./home-section-header";

type HomePromoMosaicProps = {
  tiles: HomeMosaicTile[];
};

export const HomePromoMosaic = ({ tiles }: HomePromoMosaicProps) => {
  if (tiles.length === 0) return null;

  return (
    <section className="space-y-4" aria-label="Best selling collections">
      <HomeSectionHeader title="Best selling collections" href="/shop" />
      <div className="grid auto-rows-[140px] grid-cols-2 gap-3 md:auto-rows-[180px] md:grid-cols-4 md:gap-4">
        {tiles.map((tile) => (
          <Link key={tile.id} href={tile.href} className={`group block ${tile.className}`}>
            <Card className="relative h-full overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tile.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
              <CardContent className="relative flex h-full flex-col justify-end p-4">
                <Typography variant="heading-sm" className="text-white">
                  {tile.title}
                </Typography>
                {tile.subtitle ? (
                  <Typography variant="body-xs" className="text-white/85">
                    {tile.subtitle}
                  </Typography>
                ) : null}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};
