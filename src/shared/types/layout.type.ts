import type { Icon } from "iconsax-reactjs";

export type TSidebarItem = {
  title: string;
  url: string;
  icon?: Icon;
  isActive?: boolean;
  items?: TSidebarItem[];
};
