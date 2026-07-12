"use client";

import type { ReactNode } from "react";

import { useBetween, useGreater, useSmaller } from "@/shared/hooks";
import { cn } from "@/shared/utils/cn.util";

type AppContentProps = {
  children: ReactNode;
  className?: string;
};

export const AppContent = ({ children, className }: AppContentProps) => {
  const isDesktop = useGreater("lg");
  const isTablet = useBetween("sm", "lg");
  const isMobile = useSmaller("sm");

  return (
    <div
      className={cn(
        "bg-secondary flex flex-1 flex-col",
        {
          "py-3xl px-4xl min-h-0 overflow-auto": isDesktop,
          "py-3xl px-3xl min-h-0 overflow-auto": isTablet,
          "py-2xl px-4xl overflow-visible": isMobile,
        },
        className
      )}
    >
      {children}
    </div>
  );
};
