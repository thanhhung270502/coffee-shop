"use client";

import { useState } from "react";
import type { PublicDrinkObject } from "@common/models/catalog";
import { EProductType } from "@common/models/category";

import { Button, Skeleton, Typography } from "@/shared/components";
import { useQueryCatalogCategories, useQueryCatalogDrinks } from "@/shared/queries";

import { DrinkCard } from "../components/drink-card";
import { DrinkOptionsSheet } from "../components/drink-options-sheet";

export function CustomerOrderPage() {
  const [categorySlug, setCategorySlug] = useState<string | undefined>();
  const [selectedDrink, setSelectedDrink] = useState<PublicDrinkObject | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const { data: categoriesData } = useQueryCatalogCategories(EProductType.DRINK);
  const { data: drinksData, isLoading } = useQueryCatalogDrinks(categorySlug);

  const handleSelectDrink = (drink: PublicDrinkObject) => {
    setSelectedDrink(drink);
    setSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      <Typography variant="heading-md">Order Drinks</Typography>

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="lg:w-48">
          <Typography variant="heading-sm" className="mb-3">
            Categories
          </Typography>
          <div className="flex flex-wrap gap-2 lg:flex-col">
            <Button
              type="button"
              variant={!categorySlug ? "primary" : "secondary-gray"}
              size="sm"
              onClick={() => setCategorySlug(undefined)}
            >
              All
            </Button>
            {categoriesData?.categories.map((category) => (
              <Button
                key={category.id}
                type="button"
                variant={categorySlug === category.slug ? "primary" : "secondary-gray"}
                size="sm"
                onClick={() => setCategorySlug(category.slug)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </aside>

        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-lg" />
              ))}
            </div>
          ) : drinksData?.drinks.length === 0 ? (
            <Typography variant="body-md" color="secondary">
              No drinks available.
            </Typography>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {drinksData?.drinks.map((drink) => (
                <DrinkCard key={drink.id} drink={drink} onSelect={handleSelectDrink} />
              ))}
            </div>
          )}
        </div>
      </div>

      <DrinkOptionsSheet drink={selectedDrink} open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
}
