"use client";

import { useEffect, useState } from "react";
import {
  ArrowDown2,
  Category,
  Chart,
  Coffee,
  People,
  PresentionChart,
  Setting2,
  ShoppingBag,
  ShoppingCart,
} from "iconsax-reactjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ClientRoutes, PageTitles } from "@/shared/constants";
import { RouteKey } from "@/shared/enums";
import { TSidebarItem } from "@/shared/types";
import { cn } from "@/shared/utils";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  SidebarMenuButton,
  SidebarMenuIcon,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "../";

export const ListAdminSidebar: TSidebarItem[] = [
  {
    title: PageTitles[RouteKey.AdminDashboard],
    url: ClientRoutes[RouteKey.AdminDashboard],
    icon: PresentionChart,
  },
  {
    title: PageTitles[RouteKey.AdminCategories],
    url: ClientRoutes[RouteKey.AdminCategories],
    icon: Category,
  },
  {
    title: PageTitles[RouteKey.AdminDrinks],
    url: ClientRoutes[RouteKey.AdminDrinks],
    icon: Coffee,
  },
  {
    title: PageTitles[RouteKey.AdminPackagedProducts],
    url: ClientRoutes[RouteKey.AdminPackagedProducts],
    icon: ShoppingBag,
  },
  {
    title: PageTitles[RouteKey.AdminOrders],
    url: ClientRoutes[RouteKey.AdminOrders],
    icon: ShoppingCart,
  },
  {
    title: PageTitles[RouteKey.AdminReports],
    url: ClientRoutes[RouteKey.AdminReports],
    icon: Chart,
  },
  {
    title: PageTitles[RouteKey.AdminStaff],
    url: ClientRoutes[RouteKey.AdminStaff],
    icon: People,
  },
  {
    title: PageTitles[RouteKey.AdminSettings],
    url: ClientRoutes[RouteKey.AdminSettings],
    icon: Setting2,
  },
];

export const SidebarItem = ({
  item,
  isActiveItem,
}: {
  item: TSidebarItem;
  isActiveItem: boolean;
}) => {
  const { isMobile, state } = useSidebar();

  return (
    <SidebarMenuItem>
      <Link href={item.url}>
        <SidebarMenuButton tooltip={item.title} isActive={isActiveItem}>
          {item.icon && <SidebarMenuIcon icon={item.icon} />}
          {!isMobile && state === "expanded" ? item.title : null}
        </SidebarMenuButton>
      </Link>
    </SidebarMenuItem>
  );
};

export const CollapsibleSidebarItem = ({
  item,
  isActiveItem,
}: {
  item: TSidebarItem;
  isActiveItem: boolean;
}) => {
  const pathname = usePathname();
  const { state, isMobile } = useSidebar();
  const [isOpen, setIsOpen] = useState(isActiveItem);

  useEffect(() => {
    setIsOpen(isActiveItem);
  }, [isActiveItem]);

  const checkIsActiveSubItem = (url: string) => {
    if (!url) return false;
    return pathname.startsWith(url);
  };

  if (state === "collapsed") {
    return (
      <SidebarMenuItem>
        <Menu>
          <MenuTrigger
            nativeButton={false}
            openOnHover={!isMobile}
            render={
              <Link
                href={item.url}
                className="group flex size-12 items-center justify-center rounded-md ring-0 outline-none"
              />
            }
          >
            {item.icon && <SidebarMenuIcon icon={item.icon} />}
          </MenuTrigger>
          <MenuContent
            side={isMobile ? "top" : "right"}
            align="start"
            sideOffset={12}
            className="min-w-50"
          >
            {item.items?.map((subItem) => {
              const isActiveSubItem = checkIsActiveSubItem(subItem.url);
              return (
                <Link href={subItem.url} key={subItem.title} className="ring-0 outline-none">
                  <MenuItem
                    key={subItem.title}
                    className={cn("p-lg! ring-0 outline-none", {
                      "text-brand-tertiary": isActiveSubItem,
                      "bg-primary-hover": isActiveSubItem,
                    })}
                  >
                    {subItem.title}
                  </MenuItem>
                </Link>
              );
            })}
          </MenuContent>
        </Menu>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger
          nativeButton={false}
          render={
            <Link href={item.url} className="group">
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <SidebarMenuIcon icon={item.icon} />}
                {item.title}
                {
                  <ArrowDown2
                    size={"1rem"}
                    variant="Bold"
                    className="text-quaternary ml-auto transition-transform duration-200 group-data-panel-open:rotate-180"
                  />
                }
              </SidebarMenuButton>
            </Link>
          }
        />
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((subItem) => {
              const isActiveSubItem = checkIsActiveSubItem(subItem.url);
              return (
                <SidebarMenuSubItem key={subItem.title}>
                  <Link href={subItem.url}>
                    <SidebarMenuSubButton isActive={isActiveSubItem}>
                      {subItem.title}
                    </SidebarMenuSubButton>
                  </Link>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};
