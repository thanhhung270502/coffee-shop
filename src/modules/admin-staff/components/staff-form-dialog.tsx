"use client";

import { Add } from "iconsax-reactjs";

import { Button } from "@/shared/components/button";
import { Dialog, DialogContent, DialogTrigger } from "@/shared/components/dialog";

import type { UseStaffFormReturn } from "../hooks/use-staff-form";

import { StaffForm } from "./staff-form";

type StaffFormDialogProps = UseStaffFormReturn;

export const StaffFormDialog = ({
  open,
  setOpen,
  openCreate,
  editing,
  isEditing,
  methods,
  onSubmit,
  isSubmitting,
}: StaffFormDialogProps) => (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger
      render={
        <Button variant="primary" size="sm" startIcon={Add} onClick={openCreate}>
          Add Staff
        </Button>
      }
    />
    <DialogContent className="w-full! max-w-md">
      <div className="p-6">
        <StaffForm
          methods={methods}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          editing={editing}
          isEditing={isEditing}
        />
      </div>
    </DialogContent>
  </Dialog>
);
