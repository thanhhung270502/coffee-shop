"use client";

import type { SortDirection } from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "iconsax-reactjs";

import { cn } from "@/shared/utils";

interface SortDirectionIconProps {
  direction: SortDirection;
  size?: number;
  className?: string;
}

export const SortDirectionIcon = ({ direction, size = 16, className }: SortDirectionIconProps) => {
  const IconComponent = direction === "asc" ? ArrowUp : ArrowDown;

  return <IconComponent size={size} className={cn("text-brand-quaternary", className)} />;
};

SortDirectionIcon.displayName = "SortDirectionIcon";
