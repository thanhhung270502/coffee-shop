"use client";

import { Button } from "@/shared/components/button";
import { DialogClose, DialogTitle } from "@/shared/components/dialog";
import { RHFInput } from "@/shared/components/react-hook-form/RHFInput";
import { FormProvider } from "@/shared/providers";

import type { UseStaffFormReturn } from "../hooks/use-staff-form";

type StaffFormProps = Pick<
  UseStaffFormReturn,
  "methods" | "onSubmit" | "isSubmitting" | "editing" | "isEditing"
>;

export const StaffForm = ({
  methods,
  onSubmit,
  isSubmitting,
  editing,
  isEditing,
}: StaffFormProps) => (
  <FormProvider formMethods={methods} onSubmit={onSubmit} className="flex flex-col gap-4">
    <DialogTitle>{editing ? "Edit Staff" : "Add Staff"}</DialogTitle>
    {!isEditing && (
      <>
        <RHFInput name="email" control={methods.control} label="Email" required />
        <RHFInput
          name="password"
          control={methods.control}
          label="Password"
          type="password"
          required
        />
      </>
    )}
    <RHFInput name="name" control={methods.control} label="Name" />
    <RHFInput name="phone" control={methods.control} label="Phone" />
    <div className="flex justify-end gap-2">
      <DialogClose
        render={
          <Button type="button" variant="secondary-gray" size="sm">
            Cancel
          </Button>
        }
      />
      <Button type="submit" variant="primary" size="sm" loading={isSubmitting}>
        {editing ? "Update" : "Create"}
      </Button>
    </div>
  </FormProvider>
);
