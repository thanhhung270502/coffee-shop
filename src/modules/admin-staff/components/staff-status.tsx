"use client";

import type { StaffObject } from "@common/models/staff";

import { Badge } from "@/shared/components/badge";

type StaffStatusProps = {
  staff: StaffObject;
};

export const StaffStatus = ({ staff }: StaffStatusProps) => (
  <Badge variant={staff.isActive ? "success" : "default"}>
    {staff.isActive ? "Active" : "Inactive"}
  </Badge>
);
