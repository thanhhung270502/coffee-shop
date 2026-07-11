"use client";

import type { PublicCategoryObject } from "@common/models/catalog";

import { Typography } from "@/shared/components/typography";
import { cn } from "@/shared/utils/cn.util";

type PosCategoryNavProps = {
  categories: PublicCategoryObject[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
};

export function PosCategoryNav({ categories, selected, onSelect }: PosCategoryNavProps) {
  return (
    <nav className="flex w-36 shrink-0 flex-col gap-1 overflow-y-auto border-r border-zinc-200 bg-zinc-50 p-2">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={cn(
          "rounded-lg px-3 py-2 text-left transition-colors",
          selected === null
            ? "bg-amber-600 text-white"
            : "text-zinc-700 hover:bg-zinc-200",
        )}
      >
        <Typography
          variant="body-sm"
          className={cn("font-medium", selected === null ? "text-white" : "text-zinc-700")}
        >
          All
        </Typography>
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onSelect(cat.slug)}
          className={cn(
            "rounded-lg px-3 py-2 text-left transition-colors",
            selected === cat.slug
              ? "bg-amber-600 text-white"
              : "text-zinc-700 hover:bg-zinc-200",
          )}
        >
          <Typography
            variant="body-sm"
            className={cn(
              "font-medium",
              selected === cat.slug ? "text-white" : "text-zinc-700",
            )}
          >
            {cat.name}
          </Typography>
        </button>
      ))}
    </nav>
  );
}
