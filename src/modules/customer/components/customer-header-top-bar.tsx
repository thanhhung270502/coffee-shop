"use client";

import { Coffee, Location, ShoppingBag, User } from "iconsax-reactjs";
import Link from "next/link";

import { Badge, Typography } from "@/shared/components";
import { useQueryMe, useQueryShopSettings } from "@/shared/queries";

import { useDrinkCart } from "../hooks/use-drink-cart";
import { useProductCart } from "../hooks/use-product-cart";

import { CustomerHeaderSearch } from "./customer-header-search";

export const CustomerHeaderTopBar = () => {
  const { data: settingsData } = useQueryShopSettings();
  const { data: meData } = useQueryMe();
  const { itemCount: drinkCount } = useDrinkCart();
  const { itemCount: productCount } = useProductCart();

  const settings = settingsData?.settings;
  const user = meData?.user;

  return (
    <div className="border-b border-zinc-100">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:gap-4 md:py-4">
        <Link href="/" className="shrink-0">
          <Typography variant="heading-sm" weight="semibold">
            {settings?.shopName ?? "Coffee Shop"}
          </Typography>
        </Link>

        {settings?.address ? (
          <div className="bg-brand-primary-subtle hidden min-w-0 items-center gap-1.5 rounded-full px-3 py-1.5 lg:flex">
            <Location size={16} className="text-brand-main shrink-0" />
            <Typography variant="body-xs" color="secondary" className="truncate">
              {settings.address}
            </Typography>
          </div>
        ) : null}

        <CustomerHeaderSearch />

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href={user ? "/account" : "/auth"}
            className="hidden items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 sm:flex"
          >
            <User size={18} />
            <Typography variant="body-sm" weight="medium">
              {user ? user.name ?? "Account" : "Log In"}
            </Typography>
          </Link>

          <Link
            href="/cart/drinks"
            className="relative inline-flex items-center rounded-lg border border-zinc-200 px-2.5 py-2 text-zinc-700 hover:bg-zinc-50"
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
            className="relative inline-flex items-center rounded-lg border border-zinc-200 px-2.5 py-2 text-zinc-700 hover:bg-zinc-50"
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
    </div>
  );
};
