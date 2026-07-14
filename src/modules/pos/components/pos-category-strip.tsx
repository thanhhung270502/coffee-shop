"use client";

import { useRef } from "react";
import type { PublicCategoryObject } from "@common/models/catalog";
import type { PublicDrinkObject } from "@common/models/catalog";
import { ArrowLeft2, ArrowRight2, Category2 } from "iconsax-reactjs";

import { Button, Typography } from "@/shared/components";
import { cn } from "@/shared/utils/cn.util";

type PosCategoryStripProps = {
  categories: PublicCategoryObject[];
  drinks: PublicDrinkObject[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
};

function getCategoryCount(drinks: PublicDrinkObject[], slug: string | null): number {
  if (slug === null) return drinks.length;
  return drinks.filter((d) => d.categorySlug === slug).length;
}

export function PosCategoryStrip({
  categories,
  drinks,
  selected,
  onSelect,
}: PosCategoryStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -240 : 240,
      behavior: "smooth",
    });
  };

  const items = [{ id: "all", name: "All Categories", slug: null as string | null }, ...categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Typography variant="heading-sm">Categories</Typography>
        <div className="flex items-center gap-1">
          <Button
            variant="secondary-gray"
            size="sm"
            startIcon={ArrowLeft2}
            onClick={() => scroll("left")}
            aria-label="Scroll categories left"
          />
          <Button
            variant="secondary-gray"
            size="sm"
            startIcon={ArrowRight2}
            onClick={() => scroll("right")}
            aria-label="Scroll categories right"
          />
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin"
        role="tablist"
        aria-label="Product categories"
      >
        {items.map((item) => {
          const isActive = selected === item.slug;
          const count = getCategoryCount(drinks, item.slug);
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelect(item.slug)}
              className={cn(
                "flex min-w-[120px] shrink-0 flex-col items-center gap-2 rounded-xl border bg-white p-3 text-left transition-all",
                isActive
                  ? "border-brand-main shadow-sm ring-1 ring-brand-main"
                  : "border-neutral-200 hover:border-neutral-300",
              )}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                <Category2 size={20} className="text-brand-main" />
              </div>
              <div className="w-full text-center">
                <Typography variant="body-xs" className="line-clamp-2 font-semibold">
                  {item.name}
                </Typography>
                <Typography variant="body-xs" color="secondary">
                  {count} items
                </Typography>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
