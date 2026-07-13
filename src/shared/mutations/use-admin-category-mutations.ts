"use client";

import type {
  CreateCategoryRequest,
  CreateCategoryResponse,
  DeleteCategoryResponse,
  UpdateCategoryRequest,
  UpdateCategoryResponse,
} from "@common/models/category";
import {
  API_ADMIN_CATEGORY_BY_ID,
  API_ADMIN_CATEGORY_CREATE,
  API_ADMIN_CATEGORY_DELETE,
} from "@common/models/category";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteRequest, patchRequest, postRequest } from "@/libs/api-client";
import { ADMIN_CATEGORIES_KEYS } from "@/shared/constants";

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCategoryRequest) => {
      return (await postRequest<CreateCategoryRequest>({
        path: API_ADMIN_CATEGORY_CREATE.buildUrlPath(),
        data,
      })) as CreateCategoryResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEYS.all() });
      toast.success("Category created");
    },
    onError: (error: Error) => toast.error(error.message ?? "Failed to create category"),
  });
}

export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCategoryRequest }) => {
      return (await patchRequest<UpdateCategoryRequest>({
        path: API_ADMIN_CATEGORY_BY_ID.buildUrlPath(id),
        data,
      })) as UpdateCategoryResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEYS.all() });
      toast.success("Category updated");
    },
    onError: (error: Error) => toast.error(error.message ?? "Failed to update category"),
  });
}

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return (await deleteRequest({
        path: API_ADMIN_CATEGORY_DELETE.buildUrlPath(id),
      })) as DeleteCategoryResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEYS.all() });
      toast.success("Category deleted");
    },
    onError: (error: Error) => toast.error(error.message ?? "Failed to delete category"),
  });
}
