"use client";

import { Coffee, ShoppingBag } from "iconsax-reactjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Badge } from "@/shared/components";
import { useQueryShopSettings } from "@/shared/queries";

import { useDrinkCart } from "../hooks/use-drink-cart";
import { useProductCart } from "../hooks/use-product-cart";

const navLinks = [
  { href: "/order", label: "Order Drinks" },
  { href: "/shop", label: "Shop Products" },
  { href: "/account", label: "Account" },
];

export function CustomerHeader() {
  const pathname = usePathname();
  const { data } = useQueryShopSettings();
  const { itemCount: drinkCount } = useDrinkCart();
  const { itemCount: productCount } = useProductCart();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-zinc-900">
          {data?.settings.shopName ?? "Coffee Shop"}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive ? "text-brand-main font-semibold" : "text-zinc-600 hover:text-zinc-900"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart/drinks"
            className="relative inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
            aria-label={`Drink cart${drinkCount > 0 ? `, ${drinkCount} items` : ""}`}
          >
            <Coffee size={18} />
            {drinkCount > 0 ? (
              <Badge className="absolute -top-2 -right-2 min-w-5 justify-center px-1">
                {drinkCount}
              </Badge>
            ) : null}
          </Link>
          <Link
            href="/cart/products"
            className="relative inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
            aria-label={`Product cart${productCount > 0 ? `, ${productCount} items` : ""}`}
          >
            <ShoppingBag size={18} />
            {productCount > 0 ? (
              <Badge className="absolute -top-2 -right-2 min-w-5 justify-center px-1">
                {productCount}
              </Badge>
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  );
}
