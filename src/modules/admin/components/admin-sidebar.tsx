"use client";

import { useState } from "react";
import { HamburgerMenu } from "iconsax-reactjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/shared/components/button";
import { Typography } from "@/shared/components/typography";
import { cn } from "@/shared/utils";

import { ADMIN_NAV_ITEMS } from "../constants/nav-items";

type AdminSidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-primary bg-white transition-all duration-200",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-14 items-center justify-between border-b border-primary px-4">
        {!collapsed && (
          <Typography variant="heading-sm" weight="semibold">
            Coffee Admin
          </Typography>
        )}
        <Button
          variant="tertiary-gray"
          size="sm"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <HamburgerMenu size={20} />
        </Button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-2">
        {ADMIN_NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                isActive
                  ? "bg-brand-primary text-brand-tertiary"
                  : "text-secondary hover:bg-secondary-hover hover:text-primary",
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} variant={isActive ? "Bold" : "Linear"} />
              {!collapsed && (
                <Typography variant="body-sm" weight={isActive ? "semibold" : "regular"}>
                  {item.label}
                </Typography>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function useAdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return {
    collapsed,
    toggle: () => setCollapsed((prev) => !prev),
  };
}
