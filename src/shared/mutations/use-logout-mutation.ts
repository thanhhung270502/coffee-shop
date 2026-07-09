"use client";

import { useMutation } from "@tanstack/react-query";

import { API_LOGOUT } from "@common/models/auth";
import type { LogoutResponse } from "@common/models/auth";
import { postRequest } from "@/libs/api-client";

export function useLogoutMutation() {
  return useMutation({
    mutationFn: async () => {
      return (await postRequest<Record<string, never>>({
        path: API_LOGOUT.buildUrlPath(),
        data: {},
      })) as LogoutResponse;
    },
  });
}
