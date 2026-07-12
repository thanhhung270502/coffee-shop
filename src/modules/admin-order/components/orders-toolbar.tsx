"use client";

import { SearchNormal1 } from "iconsax-reactjs";

import { DebouncedInput } from "@/shared";

import { useAdminOrdersRequest } from "../hooks/use-admin-orders-request";

import { OrdersToolbarFilter } from "./orders-toolbar-filter";

export const OrdersToolbar = () => {
  const adminOrdersRequest = useAdminOrdersRequest();
  const { search, onSearchChange } = adminOrdersRequest;

  return (
    <div className="gap-2xl flex">
      <DebouncedInput
        value={search}
        onChange={onSearchChange}
        leadingIcon={SearchNormal1}
        placeholder="Search orders"
        isClearable
        size="sm"
      />
      <OrdersToolbarFilter {...adminOrdersRequest} />
    </div>
  );
};
