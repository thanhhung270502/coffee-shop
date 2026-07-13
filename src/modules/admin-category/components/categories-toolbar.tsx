"use client";

import { SearchNormal1 } from "iconsax-reactjs";

import { DebouncedInput } from "@/shared";
import { Button } from "@/shared/components/button";

import { FILTER_TABS } from "../constants";
import type { UseAdminCategoriesRequestReturn } from "../hooks/use-admin-categories-request";

type CategoriesToolbarProps = UseAdminCategoriesRequestReturn;

export const CategoriesToolbar = ({
  search,
  type,
  onSearchChange,
  onTypeChange,
}: CategoriesToolbarProps) => (
  <div className="gap-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between">
    <div className="flex gap-2">
      {FILTER_TABS.map((tab) => (
        <Button
          key={tab.type}
          size="sm"
          variant={type === tab.type ? "primary" : "secondary-gray"}
          onClick={() => onTypeChange(tab.type)}
        >
          {tab.label}
        </Button>
      ))}
    </div>
    <DebouncedInput
      value={search}
      onChange={onSearchChange}
      leadingIcon={SearchNormal1}
      placeholder="Search categories"
      isClearable
      size="sm"
    />
  </div>
);
