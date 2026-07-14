"use client";

import { SearchNormal1 } from "iconsax-reactjs";

import { Input } from "@/shared/components";

type PosCatalogSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function PosCatalogSearch({ value, onChange }: PosCatalogSearchProps) {
  return (
    <Input
      placeholder="Search drinks..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      leadingIcon={SearchNormal1}
      aria-label="Search drinks"
    />
  );
}
