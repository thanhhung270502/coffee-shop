import type { TSidebarItem } from "../types";

export const checkActiveItem = (item: TSidebarItem, pathname: string) => {
  const haveChildren = item.items && item.items.length > 0;
  return haveChildren
    ? (item.items ?? []).some((child) => pathname.startsWith(child.url))
    : item.url === pathname;
};
