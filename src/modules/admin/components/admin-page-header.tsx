"use client";

import type { ReactNode } from "react";

import { Typography } from "@/shared/components/typography";

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Typography variant="heading-md" weight="semibold">
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
