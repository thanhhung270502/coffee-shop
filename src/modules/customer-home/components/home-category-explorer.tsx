import type { PublicCategoryObject } from "@common/models/catalog";
import { EProductType } from "@common/models/category";
import { Coffee, ShoppingBag } from "iconsax-reactjs";
import Link from "next/link";

import { Skeleton, Typography } from "@/shared/components";

import { HomeSectionHeader } from "./home-section-header";

type HomeCategoryExplorerProps = {
  categories: PublicCategoryObject[];
  isLoading: boolean;
};

const getCategoryHref = (category: PublicCategoryObject) =>
  category.type === EProductType.DRINK
    ? `/order?category=${category.slug}`
    : `/shop?category=${category.slug}`;

export const HomeCategoryExplorer = ({ categories, isLoading }: HomeCategoryExplorerProps) => {
  if (!isLoading && categories.length === 0) return null;

  return (
    <section className="space-y-4" aria-label="Browse categories">
      <HomeSectionHeader title="Start exploring now" />
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible md:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex shrink-0 flex-col items-center gap-2">
                <Skeleton className="size-20 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))
          : categories.map((category) => {
              const Icon = category.type === EProductType.DRINK ? Coffee : ShoppingBag;

              return (
                <Link
                  key={category.id}
                  href={getCategoryHref(category)}
                  className="group flex w-24 shrink-0 snap-start flex-col items-center gap-2 md:w-auto"
                >
                  <div className="bg-brand-primary-subtle group-hover:bg-brand-primary flex size-20 items-center justify-center rounded-full transition-colors">
                    <Icon size={28} className="text-brand-main" variant="Bold" />
                  </div>
                  <Typography variant="body-xs" className="line-clamp-2 text-center" weight="medium">
                    {category.name}
                  </Typography>
                </Link>
              );
            })}
      </div>
    </section>
  );
};
