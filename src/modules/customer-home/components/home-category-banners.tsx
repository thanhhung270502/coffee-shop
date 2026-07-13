import type { PublicCategoryObject } from "@common/models/catalog";
import { EProductType } from "@common/models/category";
import Link from "next/link";

import { Card, CardContent, Skeleton, Typography } from "@/shared/components";

type HomeCategoryBannersProps = {
  categories: PublicCategoryObject[];
  isLoading: boolean;
};

export const HomeCategoryBanners = ({ categories, isLoading }: HomeCategoryBannersProps) => {
  const displayCategories = categories.slice(0, 4);

  if (!isLoading && displayCategories.length === 0) return null;

  return (
    <section aria-label="Category shortcuts">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl md:h-28" />
            ))
          : displayCategories.map((category) => {
              const href =
                category.type === EProductType.DRINK
                  ? `/order?category=${category.slug}`
                  : `/shop?category=${category.slug}`;

              return (
                <Link key={category.id} href={href}>
                  <Card className="bg-brand-primary-subtle h-full transition-all hover:-translate-y-0.5 hover:shadow-sm">
                    <CardContent className="flex min-h-24 items-center justify-center p-4 md:min-h-28">
                      <Typography
                        variant="heading-sm"
                        className="text-center"
                        weight="semibold"
                      >
                        {category.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
      </div>
    </section>
  );
};
