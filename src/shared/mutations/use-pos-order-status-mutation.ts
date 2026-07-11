"use client";

import type { UpdatePosOrderStatusRequest, UpdatePosOrderStatusResponse } from "@common/models/pos";
import { API_POS_UPDATE_ORDER_STATUS } from "@common/models/pos";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { patchRequest } from "@/libs/api-client";
import { POS_QUEUE_QUERY_KEY } from "@/shared/queries/use-query-pos-queue";

export function usePosOrderStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdatePosOrderStatusRequest }) =>
      (await patchRequest<UpdatePosOrderStatusRequest>({
        path: API_POS_UPDATE_ORDER_STATUS.buildUrlPath(id),
        data,
      })) as UpdatePosOrderStatusResponse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POS_QUEUE_QUERY_KEY });
    },
  });
}
