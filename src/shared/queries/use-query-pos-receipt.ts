"use client";

import type { GetPosReceiptResponse } from "@common/models/pos";
import { API_POS_RECEIPT } from "@common/models/pos";
import { useQuery } from "@tanstack/react-query";

import { getRequest } from "@/libs/api-client";

export const POS_RECEIPT_QUERY_KEY = ["pos", "receipt"] as const;

export function useQueryPosReceipt(orderId: string) {
  return useQuery({
    queryKey: [...POS_RECEIPT_QUERY_KEY, orderId],
    queryFn: async () => {
      const data = await getRequest({ path: API_POS_RECEIPT.buildUrlPath(orderId) });
      return data as GetPosReceiptResponse;
    },
    enabled: !!orderId,
  });
}
