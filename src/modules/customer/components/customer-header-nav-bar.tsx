"use client";

import { EProductType } from "@common/models/category";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Skeleton, Typography } from "@/shared/components";
import { useQueryCatalogCategories } from "@/shared/queries";

const primaryLinks = [
  { href: "/order", label: "Order Drinks" },
  { href: "/shop", label: "Shop Products" },
  { href: "/account", label: "Account" },
];

export const CustomerHeaderNavBar = () => {
  const pathname = usePathname();
  const { data: drinkCategoriesData, isLoading: drinkCategoriesLoading } =
    useQueryCatalogCategories(EProductType.DRINK);
  const { data: productCategoriesData, isLoading: productCategoriesLoading } =
    useQueryCatalogCategories(EProductType.PACKAGED);

  const isLoading = drinkCategoriesLoading || productCategoriesLoading;
  const categoryLinks = [
    ...(drinkCategoriesData?.categories.slice(0, 4) ?? []).map((category) => ({
      href: `/order?category=${category.slug}`,
      label: category.name,
    })),
    ...(productCategoriesData?.categories.slice(0, 2) ?? []).map((category) => ({
      href: `/shop?category=${category.slug}`,
      label: category.name,
    })),
  ];

  return (
    <nav
      className="bg-brand-primary-subtle hidden border-b border-zinc-100 md:block"
      aria-label="Primary navigation"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-4 py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {primaryLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 text-sm font-medium transition-colors ${
                isActive ? "text-brand-main font-semibold" : "text-zinc-600 hover:text-zinc-900"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {link.label}
            </Link>
          );
        })}

        <span className="h-4 w-px shrink-0 bg-zinc-300" aria-hidden="true" />

        {isLoading ? (
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-16" />
            ))}
          </div>
        ) : (
          categoryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 text-sm text-zinc-600 transition-colors hover:text-zinc-900"
            >
              <Typography variant="body-sm" weight="medium">
                {link.label}
              </Typography>
            </Link>
          ))
        )}
      </div>
    </nav>
  );
};
