"use client";

import type { UpdateOrderStatusRequest, UpdateOrderStatusResponse } from "@common/models/order";
import { API_ADMIN_ORDER_STATUS } from "@common/models/order";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { patchRequest } from "@/libs/api-client";
import { ADMIN_ORDERS_QUERY_KEY } from "@/shared/queries/use-query-admin-orders";

export function useUpdateOrderStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateOrderStatusRequest }) =>
      (await patchRequest<UpdateOrderStatusRequest>({
        path: API_ADMIN_ORDER_STATUS.buildUrlPath(id),
        data,
      })) as UpdateOrderStatusResponse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      toast.success("Order status updated");
    },
    onError: (error: Error) => toast.error(error.message ?? "Failed to update order status"),
  });
}
