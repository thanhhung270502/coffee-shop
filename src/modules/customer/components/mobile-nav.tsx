"use client";

import { Coffee, Home2, ShoppingBag, User } from "iconsax-reactjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Badge } from "@/shared/components";

import { useDrinkCart } from "../hooks/use-drink-cart";
import { useProductCart } from "../hooks/use-product-cart";

const navItems = [
  { href: "/", label: "Home", icon: Home2, exact: true },
  { href: "/order", label: "Drinks", icon: Coffee, exact: false },
  { href: "/shop", label: "Shop", icon: ShoppingBag, exact: false },
  { href: "/account", label: "Account", icon: User, exact: false },
];

export function MobileNav() {
  const pathname = usePathname();
  const { itemCount: drinkCount } = useDrinkCart();
  const { itemCount: productCount } = useProductCart();

  return (
    <nav
      className="fixed right-0 bottom-0 left-0 z-40 border-t border-zinc-200 bg-white/95 backdrop-blur md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="pb-safe flex items-center justify-around px-2 py-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          const showDrinkBadge = href === "/order" && drinkCount > 0;
          const showProductBadge = href === "/shop" && productCount > 0;

          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center gap-0.5 px-3 py-2"
              aria-current={isActive ? "page" : undefined}
            >
              <div className="relative">
                <Icon
                  size={22}
                  variant={isActive ? "Bold" : "Linear"}
                  className={isActive ? "text-brand-main" : "text-zinc-400"}
                />
                {(showDrinkBadge || showProductBadge) && (
                  <Badge className="absolute -top-1.5 -right-1.5 min-w-4 justify-center px-0.5 text-[10px]">
                    {showDrinkBadge ? drinkCount : productCount}
                  </Badge>
                )}
              </div>
              <span
                className={`text-[10px] font-medium ${isActive ? "text-brand-main" : "text-zinc-400"}`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
