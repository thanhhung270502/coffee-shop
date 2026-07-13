"use client";

import type { PublicDrinkObject, PublicProductObject } from "@common/models/catalog";

import { Skeleton, Typography } from "@/shared/components";
import { useSmaller } from "@/shared/hooks";

import { HomeDrinkCard } from "./home-drink-card";
import { HomeProductCard } from "./home-product-card";
import { HomeSectionHeader } from "./home-section-header";

type HomeDrinksRowProps = {
  title: string;
  href: string;
  drinks: PublicDrinkObject[];
  isLoading: boolean;
};

export const HomeDrinksRow = ({ title, href, drinks, isLoading }: HomeDrinksRowProps) => {
  const isMobile = useSmaller("md");

  return (
    <section className="space-y-4" aria-label={title}>
      <HomeSectionHeader title={title} href={href} />
      {isLoading ? (
        <div
          className={
            isMobile
              ? "flex gap-4 overflow-hidden"
              : "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6"
          }
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className={`h-72 rounded-lg ${isMobile ? "w-[240px] shrink-0" : ""}`}
            />
          ))}
        </div>
      ) : drinks.length === 0 ? (
        <TypographyEmpty message="No drinks available yet." />
      ) : (
        <div
          className={
            isMobile
              ? "flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              : "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6"
          }
        >
          {drinks.map((drink) => (
            <HomeDrinkCard key={drink.id} drink={drink} />
          ))}
        </div>
      )}
    </section>
  );
};

type HomeProductsRowProps = {
  title: string;
  href: string;
  products: PublicProductObject[];
  isLoading: boolean;
};

export const HomeProductsRow = ({
  title,
  href,
  products,
  isLoading,
}: HomeProductsRowProps) => {
  const isMobile = useSmaller("md");

  return (
    <section className="space-y-4" aria-label={title}>
      <HomeSectionHeader title={title} href={href} />
      {isLoading ? (
        <div
          className={
            isMobile
              ? "flex gap-4 overflow-hidden"
              : "grid grid-cols-2 gap-4 md:grid-cols-4"
          }
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              className={`h-72 rounded-lg ${isMobile ? "w-[240px] shrink-0" : ""}`}
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <TypographyEmpty message="No products available yet." />
      ) : (
        <div
          className={
            isMobile
              ? "flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              : "grid grid-cols-2 gap-4 md:grid-cols-4"
          }
        >
          {products.map((product) => (
            <HomeProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

const TypographyEmpty = ({ message }: { message: string }) => (
  <Typography variant="body-sm" color="secondary">
    {message}
  </Typography>
);
