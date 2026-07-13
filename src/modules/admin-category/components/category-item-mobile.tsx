"use client";

import type { CategoryObject } from "@common/models/category";
import { Edit2, Trash } from "iconsax-reactjs";

import { Button } from "@/shared/components/button";
import { Typography } from "@/shared/components/typography";

import type { UseCategoryFormReturn } from "../hooks/use-category-form";

import { CategoryStatus } from "./category-status";

type CategoryItemMobileProps = {
  category: CategoryObject;
  openEdit: UseCategoryFormReturn["openEdit"];
  onDelete: (id: string) => void;
  isDeleting: boolean;
};

export const CategoryItemMobile = ({
  category,
  openEdit,
  onDelete,
  isDeleting,
}: CategoryItemMobileProps) => (
  <div className="gap-md p-lg flex flex-col rounded-xl border border-gray-200 bg-white">
    <div className="flex items-start justify-between">
      <div className="gap-xs flex flex-col">
        <Typography variant="body-sm" className="font-medium">
          {category.name}
        </Typography>
        <Typography variant="body-xs" color="secondary">
          {category.slug}
        </Typography>
      </div>
      <CategoryStatus category={category} />
    </div>
    <div className="flex items-center justify-between">
      <Typography variant="body-xs" color="secondary">
        {category.productCount} products · Sort: {category.sortOrder}
      </Typography>
      <div className="flex gap-2">
        <Button
          variant="tertiary-gray"
          size="xs"
          startIcon={Edit2}
          onClick={() => openEdit(category)}
        >
          Edit
        </Button>
        <Button
          variant="destructive-tertiary"
          size="xs"
          startIcon={Trash}
          onClick={() => onDelete(category.id)}
          disabled={isDeleting}
        >
          Delete
        </Button>
      </div>
    </div>
  </div>
);
