"use client";

import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { StaffObject } from "@common/models/staff";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  useCreateStaffMutation,
  useUpdateStaffMutation,
} from "@/shared/mutations/use-admin-staff-mutations";

export const staffFormSchema = (isEditing: boolean) =>
  z
    .object({
      email: z.string(),
      password: z.string(),
      name: z.string(),
      phone: z.string(),
    })
    .superRefine((data, ctx) => {
      if (isEditing) return;

      if (!data.email) {
        ctx.addIssue({
          code: "custom",
          message: "Email is required",
          path: ["email"],
        });
      } else if (!z.string().email().safeParse(data.email).success) {
        ctx.addIssue({
          code: "custom",
          message: "Please enter a valid email address",
          path: ["email"],
        });
      }

      if (!data.password || data.password.length < 8) {
        ctx.addIssue({
          code: "custom",
          message: "Password must be at least 8 characters",
          path: ["password"],
        });
      }
    });

export type StaffFormData = z.infer<ReturnType<typeof staffFormSchema>>;

const defaultValues: StaffFormData = {
  email: "",
  password: "",
  name: "",
  phone: "",
};

export const useStaffForm = () => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<StaffObject | null>(null);
  const editingRef = useRef<StaffObject | null>(null);
  editingRef.current = editing;

  const createMutation = useCreateStaffMutation();
  const updateMutation = useUpdateStaffMutation();

  const methods = useForm<StaffFormData>({
    resolver: (values, context, options) =>
      zodResolver(staffFormSchema(!!editingRef.current))(values, context, options),
    defaultValues,
  });

  const openCreate = useCallback(() => {
    setEditing(null);
    methods.reset(defaultValues);
    setOpen(true);
  }, [methods]);

  const openEdit = useCallback(
    (staff: StaffObject) => {
      setEditing(staff);
      methods.reset({
        email: staff.email,
        password: "",
        name: staff.name ?? "",
        phone: staff.phone ?? "",
      });
      setOpen(true);
    },
    [methods],
  );

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen);
      if (!isOpen) {
        setEditing(null);
        methods.reset(defaultValues);
      }
    },
    [methods],
  );

  const onSubmit = methods.handleSubmit(async (values) => {
    if (editing) {
      await updateMutation.mutateAsync({
        id: editing.id,
        data: { name: values.name, phone: values.phone || null },
      });
    } else {
      await createMutation.mutateAsync({
        email: values.email,
        password: values.password,
        name: values.name || undefined,
        phone: values.phone || undefined,
      });
    }
    setOpen(false);
    setEditing(null);
    methods.reset(defaultValues);
  });

  return {
    open,
    setOpen: handleOpenChange,
    openCreate,
    openEdit,
    editing,
    isEditing: !!editing,
    methods,
    onSubmit,
    isSubmitting: methods.formState.isSubmitting,
  };
};

export type UseStaffFormReturn = ReturnType<typeof useStaffForm>;
