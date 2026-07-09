"use client";

import type {
  CreatePackagedProductRequest,
  CreatePackagedProductResponse,
  UpdatePackagedProductRequest,
  UpdatePackagedProductResponse,
  UpdateProductStockRequest,
  UpdateProductStockResponse,
} from "@common/models/product";
import {
  API_ADMIN_PRODUCT_CREATE,
  API_ADMIN_PRODUCT_STOCK,
  API_ADMIN_PRODUCT_UPDATE,
} from "@common/models/product";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { patchRequest, postRequest } from "@/libs/api-client";
import { ADMIN_PRODUCTS_QUERY_KEY } from "@/shared/queries/use-query-admin-products";

export function useCreateProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreatePackagedProductRequest) =>
      (await postRequest<CreatePackagedProductRequest>({
        path: API_ADMIN_PRODUCT_CREATE.buildUrlPath(),
        data,
      })) as CreatePackagedProductResponse,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_QUERY_KEY }),
  });
}

export function useUpdateProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdatePackagedProductRequest }) =>
      (await patchRequest<UpdatePackagedProductRequest>({
        path: API_ADMIN_PRODUCT_UPDATE.buildUrlPath(id),
        data,
      })) as UpdatePackagedProductResponse,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_QUERY_KEY }),
  });
}

export function useUpdateProductStockMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProductStockRequest }) =>
      (await patchRequest<UpdateProductStockRequest>({
        path: API_ADMIN_PRODUCT_STOCK.buildUrlPath(id),
        data,
      })) as UpdateProductStockResponse,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_QUERY_KEY }),
  });
}
