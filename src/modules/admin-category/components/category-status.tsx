"use client";

import type { CategoryObject } from "@common/models/category";

import { Badge } from "@/shared/components/badge";

type CategoryStatusProps = {
  category: CategoryObject;
};

export const CategoryStatus = ({ category }: CategoryStatusProps) => (
  <Badge variant={category.isActive ? "success" : "default"}>
    {category.isActive ? "Active" : "Hidden"}
  </Badge>
);
