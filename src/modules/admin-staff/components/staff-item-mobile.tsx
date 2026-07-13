"use client";

import type { StaffObject } from "@common/models/staff";
import { Edit2 } from "iconsax-reactjs";

import { Button } from "@/shared/components/button";
import { Typography } from "@/shared/components/typography";
import { useResetStaffPasswordMutation } from "@/shared/mutations/use-admin-staff-mutations";

import type { UseStaffFormReturn } from "../hooks/use-staff-form";

import { StaffStatus } from "./staff-status";

type StaffItemMobileProps = {
  staff: StaffObject;
  openEdit: UseStaffFormReturn["openEdit"];
};

export const StaffItemMobile = ({ staff, openEdit }: StaffItemMobileProps) => {
  const resetPasswordMutation = useResetStaffPasswordMutation();

  const handleResetPassword = () => {
    const password = prompt("New password (min 8 characters):");
    if (password) {
      resetPasswordMutation.mutate({ id: staff.id, data: { password } });
    }
  };

  return (
    <div className="gap-md p-lg flex flex-col rounded-xl border border-gray-200 bg-white">
      <div className="flex items-start justify-between">
        <div className="gap-xs flex flex-col">
          <Typography variant="body-sm" className="font-medium">
            {staff.name ?? "—"}
          </Typography>
          <Typography variant="body-xs" color="secondary">
            {staff.email}
          </Typography>
        </div>
        <StaffStatus staff={staff} />
      </div>
      {staff.phone && (
        <Typography variant="body-xs" color="secondary">
          {staff.phone}
        </Typography>
      )}
      <div className="flex justify-end gap-2">
        <Button
          variant="tertiary-gray"
          size="xs"
          startIcon={Edit2}
          onClick={() => openEdit(staff)}
        >
          Edit
        </Button>
        <Button
          variant="secondary-gray"
          size="xs"
          onClick={handleResetPassword}
          disabled={resetPasswordMutation.isPending}
        >
          Reset Password
        </Button>
      </div>
    </div>
  );
};
