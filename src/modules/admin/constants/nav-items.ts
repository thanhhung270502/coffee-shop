import type { Icon } from "iconsax-reactjs";
import {
  Category,
  Coffee,
  Element3,
  People,
  Setting2,
  ShoppingBag,
  ShoppingCart,
} from "iconsax-reactjs";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: Icon;
  exact?: boolean;
};

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: Element3, exact: true },
  { label: "Categories", href: "/admin/categories", icon: Category },
  { label: "Drinks", href: "/admin/drinks", icon: Coffee },
  { label: "Packaged Products", href: "/admin/products", icon: ShoppingBag },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Staff", href: "/admin/staff", icon: People },
  { label: "Settings", href: "/admin/settings", icon: Setting2 },
];
