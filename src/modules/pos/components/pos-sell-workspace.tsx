"use client";

import { useMemo, useState } from "react";
import type { PublicDrinkObject } from "@common/models/catalog";
import type { PublicCategoryObject } from "@common/models/catalog";

import { Skeleton, Typography } from "@/shared/components";

import { PosCatalogSearch } from "./pos-catalog-search";
import { PosCategoryStrip } from "./pos-category-strip";
import { PosDrinkCard } from "./pos-drink-card";
import { PosSellActionBar } from "./pos-sell-action-bar";

type PosSellWorkspaceProps = {
  categories: PublicCategoryObject[];
  drinks: PublicDrinkObject[];
  isLoading: boolean;
  selectedCategorySlug: string | null;
  onSelectCategory: (slug: string | null) => void;
  onSelectDrink: (drink: PublicDrinkObject) => void;
  onReset: () => void;
  onOpenTransactions: () => void;
};

export function PosSellWorkspace({
  categories,
  drinks,
  isLoading,
  selectedCategorySlug,
  onSelectCategory,
  onSelectDrink,
  onReset,
  onOpenTransactions,
}: PosSellWorkspaceProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDrinks = useMemo(() => {
    let result = selectedCategorySlug
      ? drinks.filter((d) => d.categorySlug === selectedCategorySlug)
      : drinks;

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          d.categoryName.toLowerCase().includes(query),
      );
    }

    return result;
  }, [drinks, selectedCategorySlug, searchQuery]);

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <div className="space-y-4 border-b border-neutral-200 bg-white p-4">
        <PosSellActionBar onReset={onReset} onOpenTransactions={onOpenTransactions} />
        <PosCategoryStrip
          categories={categories}
          drinks={drinks}
          selected={selectedCategorySlug}
          onSelect={onSelectCategory}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4 flex justify-end">
          <div className="w-full max-w-xs">
            <PosCatalogSearch value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/5] rounded-xl" />
            ))}
          </div>
        ) : filteredDrinks.length === 0 ? (
          <div className="flex h-full min-h-48 flex-col items-center justify-center gap-2">
            <Typography variant="body-md" color="secondary">
              No drinks available
            </Typography>
            {searchQuery ? (
              <Typography variant="body-sm" color="secondary">
                Try a different search term
              </Typography>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredDrinks.map((drink) => (
              <PosDrinkCard key={drink.id} drink={drink} onSelect={onSelectDrink} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
