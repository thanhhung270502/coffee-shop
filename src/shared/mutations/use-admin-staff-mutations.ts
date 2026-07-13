"use client";

import type {
  CreateStaffRequest,
  CreateStaffResponse,
  ResetStaffPasswordRequest,
  ResetStaffPasswordResponse,
  UpdateStaffRequest,
  UpdateStaffResponse,
} from "@common/models/staff";
import {
  API_ADMIN_STAFF_BY_ID,
  API_ADMIN_STAFF_CREATE,
  API_ADMIN_STAFF_RESET_PASSWORD,
} from "@common/models/staff";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { patchRequest, postRequest } from "@/libs/api-client";
import { ADMIN_STAFF_KEYS } from "@/shared/constants/query-keys.constant";

export function useCreateStaffMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateStaffRequest) =>
      (await postRequest<CreateStaffRequest>({
        path: API_ADMIN_STAFF_CREATE.buildUrlPath(),
        data,
      })) as CreateStaffResponse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_STAFF_KEYS.all() });
      toast.success("Staff account created");
    },
    onError: (error: Error) => toast.error(error.message ?? "Failed to create staff account"),
  });
}

export function useUpdateStaffMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateStaffRequest }) =>
      (await patchRequest<UpdateStaffRequest>({
        path: API_ADMIN_STAFF_BY_ID.buildUrlPath(id),
        data,
      })) as UpdateStaffResponse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_STAFF_KEYS.all() });
      toast.success("Staff updated");
    },
    onError: (error: Error) => toast.error(error.message ?? "Failed to update staff"),
  });
}

export function useResetStaffPasswordMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ResetStaffPasswordRequest }) =>
      (await patchRequest<ResetStaffPasswordRequest>({
        path: API_ADMIN_STAFF_RESET_PASSWORD.buildUrlPath(id),
        data,
      })) as ResetStaffPasswordResponse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_STAFF_KEYS.all() });
      toast.success("Password reset successfully");
    },
    onError: (error: Error) => toast.error(error.message ?? "Failed to reset password"),
  });
}
