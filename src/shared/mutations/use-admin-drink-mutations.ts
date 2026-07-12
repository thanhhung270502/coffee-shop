"use client";

import type {
  CreateDrinkRequest,
  CreateDrinkResponse,
  UpdateDrinkRequest,
  UpdateDrinkResponse,
  UpdateDrinkStatusRequest,
  UpdateDrinkStatusResponse,
} from "@common/models/product";
import {
  API_ADMIN_DRINK_CREATE,
  API_ADMIN_DRINK_STATUS,
  API_ADMIN_DRINK_UPDATE,
} from "@common/models/product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { patchRequest, postRequest } from "@/libs/api-client";
import { ADMIN_DRINKS_QUERY_KEY } from "@/shared/queries/use-query-admin-drinks";

export function useCreateDrinkMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateDrinkRequest) =>
      (await postRequest<CreateDrinkRequest>({
        path: API_ADMIN_DRINK_CREATE.buildUrlPath(),
        data,
      })) as CreateDrinkResponse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_DRINKS_QUERY_KEY });
      toast.success("Drink created");
    },
    onError: (error: Error) => toast.error(error.message ?? "Failed to create drink"),
  });
}

export function useUpdateDrinkMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateDrinkRequest }) =>
      (await patchRequest<UpdateDrinkRequest>({
        path: API_ADMIN_DRINK_UPDATE.buildUrlPath(id),
        data,
      })) as UpdateDrinkResponse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_DRINKS_QUERY_KEY });
      toast.success("Drink updated");
    },
    onError: (error: Error) => toast.error(error.message ?? "Failed to update drink"),
  });
}

export function useUpdateDrinkStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateDrinkStatusRequest }) =>
      (await patchRequest<UpdateDrinkStatusRequest>({
        path: API_ADMIN_DRINK_STATUS.buildUrlPath(id),
        data,
      })) as UpdateDrinkStatusResponse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_DRINKS_QUERY_KEY });
      toast.success("Drink status updated");
    },
    onError: (error: Error) => toast.error(error.message ?? "Failed to update drink status"),
  });
}
