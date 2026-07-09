"use client";

import type {
  CreateToppingRequest,
  CreateToppingResponse,
  DeleteToppingResponse,
  UpdateToppingRequest,
  UpdateToppingResponse,
} from "@common/models/topping";
import {
  API_ADMIN_TOPPING_BY_ID,
  API_ADMIN_TOPPING_CREATE,
  API_ADMIN_TOPPING_DELETE,
} from "@common/models/topping";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteRequest, patchRequest, postRequest } from "@/libs/api-client";
import { ADMIN_TOPPINGS_QUERY_KEY } from "@/shared/queries/use-query-admin-toppings";

export function useCreateToppingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateToppingRequest) =>
      (await postRequest<CreateToppingRequest>({
        path: API_ADMIN_TOPPING_CREATE.buildUrlPath(),
        data,
      })) as CreateToppingResponse,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADMIN_TOPPINGS_QUERY_KEY }),
  });
}

export function useUpdateToppingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateToppingRequest }) =>
      (await patchRequest<UpdateToppingRequest>({
        path: API_ADMIN_TOPPING_BY_ID.buildUrlPath(id),
        data,
      })) as UpdateToppingResponse,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADMIN_TOPPINGS_QUERY_KEY }),
  });
}

export function useDeleteToppingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      (await deleteRequest({ path: API_ADMIN_TOPPING_DELETE.buildUrlPath(id) })) as DeleteToppingResponse,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADMIN_TOPPINGS_QUERY_KEY }),
  });
}
