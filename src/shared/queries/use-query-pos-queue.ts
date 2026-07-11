"use client";

import type { ListPosQueueResponse } from "@common/models/pos";
import { API_POS_QUEUE } from "@common/models/pos";
import { useQuery } from "@tanstack/react-query";

import { getRequest } from "@/libs/api-client";

export const POS_QUEUE_QUERY_KEY = ["pos", "queue"] as const;

export function useQueryPosQueue() {
  return useQuery({
    queryKey: POS_QUEUE_QUERY_KEY,
    queryFn: async () => {
      const data = await getRequest({ path: API_POS_QUEUE.buildUrlPath() });
      return data as ListPosQueueResponse;
    },
    refetchInterval: 12_000,
  });
}
