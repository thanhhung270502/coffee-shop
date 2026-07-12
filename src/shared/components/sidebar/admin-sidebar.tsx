"use client";

import { usePathname } from "next/navigation";

import { cn } from "@/shared/utils";

import { checkActiveItem, Typography } from "../../";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "../";

import { CollapsibleSidebarItem, ListAdminSidebar, SidebarItem } from "./sidebar-item";

export const AdminSidebar = () => {
  const pathname = usePathname();
  const { state, isMobile } = useSidebar();

  return (
    <Sidebar side={isMobile ? "bottom" : "left"} variant="sidebar" collapsible="icon">
      {!isMobile && (
        <SidebarHeader>
          <div
            className={cn("flex items-center justify-between", {
              "gap-md flex-col": state === "collapsed",
            })}
          >
            <Typography variant="heading-sm">{state === "collapsed" ? "Ad" : "Admin"}</Typography>
            <SidebarTrigger />
          </div>
        </SidebarHeader>
      )}

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {ListAdminSidebar.map((item) => {
              const haveChildren = item.items && item.items.length > 0;
              const isActiveItem = checkActiveItem(item, pathname);
              return haveChildren ? (
                <CollapsibleSidebarItem key={item.title} item={item} isActiveItem={isActiveItem} />
              ) : (
                <SidebarItem key={item.title} item={item} isActiveItem={isActiveItem} />
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
};
