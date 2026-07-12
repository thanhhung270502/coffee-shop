"use client";

import type { ReactNode } from "react";

import { Typography } from "@/shared/components/typography";

type PageHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Typography variant="heading-sm" weight="semibold">
          {title}
        </Typography>
        {description && (
          <Typography variant="body-sm" color="secondary" className="mt-1">
            {description}
          </Typography>
        )}
      </div>
      {action}
    </div>
  );
}
