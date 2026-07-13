"use client";

import type { KeyboardEvent } from "react";
import { useState } from "react";
import { SearchNormal1 } from "iconsax-reactjs";
import { useRouter } from "next/navigation";

import { Input } from "@/shared/components";

export const CustomerHeaderSearch = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/order?q=${encodeURIComponent(trimmed)}`);
      return;
    }
    router.push("/order");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="hidden flex-1 md:block md:max-w-md lg:max-w-xl">
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search drinks and products..."
        aria-label="Search drinks and products"
        leadingIcon={SearchNormal1}
        size="sm"
      />
    </div>
  );
};
