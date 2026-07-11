"use client";

import Link from "next/link";

import { Button, Skeleton, Typography } from "@/shared/components";
import { useQueryCatalogDrinks, useQueryCatalogProducts } from "@/shared/queries";

import { DrinkCard } from "../components/drink-card";
import { ProductCard } from "../components/product-card";

export function CustomerHomePage() {
  const { data: drinksData, isLoading: drinksLoading } = useQueryCatalogDrinks();
  const { data: productsData, isLoading: productsLoading } = useQueryCatalogProducts();

  const popularDrinks = drinksData?.drinks.slice(0, 6) ?? [];
  const featuredProducts = productsData?.products.slice(0, 4) ?? [];

  return (
    <div className="space-y-12">
      <section className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 px-6 py-12 text-center md:px-12">
        <Typography variant="heading-xl" className="mb-4">
          Fresh coffee, delivered fast
        </Typography>
        <Typography variant="body-lg" color="secondary" className="mx-auto mb-8 max-w-xl">
          Order your favorite drinks online or shop our packaged coffee products.
        </Typography>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/order">
            <Button variant="primary" size="lg">
              Order Drinks
            </Button>
          </Link>
          <Link href="/shop">
            <Button variant="secondary-gray" size="lg">
              Shop Products
            </Button>
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <Typography variant="heading-md">Popular Drinks</Typography>
          <Link href="/order" className="text-sm font-medium text-brand-main hover:underline">
            View all
          </Link>
        </div>
        {drinksLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {popularDrinks.map((drink) => (
              <Link key={drink.id} href="/order">
                <DrinkCard drink={drink} onSelect={() => undefined} />
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <Typography variant="heading-md">Featured Products</Typography>
          <Link href="/shop" className="text-sm font-medium text-brand-main hover:underline">
            View all
          </Link>
        </div>
        {productsLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {featuredProducts.map((product) => (
              <Link key={product.id} href="/shop">
                <ProductCard product={product} onSelect={() => undefined} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
