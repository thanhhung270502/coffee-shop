"use client";

import Link from "next/link";

import { Button, Card, CardContent, Skeleton, Typography } from "@/shared/components";
import { useQueryCatalogDrinks, useQueryCatalogProducts } from "@/shared/queries";
import { formatCurrency } from "@/shared/utils/currency.util";

export function CustomerHomePage() {
  const { data: drinksData, isLoading: drinksLoading } = useQueryCatalogDrinks();
  const { data: productsData, isLoading: productsLoading } = useQueryCatalogProducts();

  const popularDrinks = drinksData?.drinks.slice(0, 6) ?? [];
  const featuredProducts = productsData?.products.slice(0, 4) ?? [];

  return (
    <div className="space-y-12">
      <section className="rounded-2xl bg-linear-to-br from-amber-50 to-orange-100 px-6 py-12 text-center md:px-12">
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
          <Link href="/order" className="text-brand-main text-sm font-medium hover:underline">
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
              <Link key={drink.id} href="/order" className="block">
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
                      <div className="flex h-full items-center justify-center text-zinc-300">
                        <span className="text-3xl">☕</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="space-y-1">
                    <Typography variant="heading-sm" className="line-clamp-1">
                      {drink.name}
                    </Typography>
                    <Typography variant="body-sm" color="secondary">
                      From {formatCurrency(drink.minPrice)}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <Typography variant="heading-md">Featured Products</Typography>
          <Link href="/shop" className="text-brand-main text-sm font-medium hover:underline">
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
              <Link key={product.id} href="/shop" className="block">
                <Card className="h-full overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <div className="aspect-4/3 overflow-hidden bg-zinc-100">
                    {product.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-zinc-300">
                        <span className="text-3xl">📦</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="space-y-1">
                    <Typography variant="heading-sm" className="line-clamp-1">
                      {product.name}
                    </Typography>
                    <Typography variant="body-sm" color="secondary">
                      From {formatCurrency(product.minPrice)}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
