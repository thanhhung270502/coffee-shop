"use client";

import { SearchNormal1 } from "iconsax-reactjs";

import { DebouncedInput } from "@/shared";
import { Button } from "@/shared/components/button";

import { STATUS_TABS } from "../constants";
import type { UseAdminStaffRequestReturn } from "../hooks/use-admin-staff-request";

type StaffToolbarProps = UseAdminStaffRequestReturn;

export const StaffToolbar = ({ search, status, onSearchChange, onStatusChange }: StaffToolbarProps) => (
  <div className="gap-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between">
    <div className="flex gap-2">
      {STATUS_TABS.map((tab) => (
        <Button
          key={tab.status || "all"}
          size="sm"
          variant={status === tab.status ? "primary" : "secondary-gray"}
          onClick={() => onStatusChange(tab.status)}
        >
          {tab.label}
        </Button>
      ))}
    </div>
    <DebouncedInput
      value={search}
      onChange={onSearchChange}
      leadingIcon={SearchNormal1}
      placeholder="Search staff"
      isClearable
      size="sm"
    />
  </div>
);
