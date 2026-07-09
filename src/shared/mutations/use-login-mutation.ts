"use client";

import { useMutation } from "@tanstack/react-query";

import { API_LOGIN } from "@common/models/auth";
import type { LoginRequest, LoginResponse } from "@common/models/auth";
import { postRequest } from "@/libs/api-client";

export function useLoginMutation() {
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      return (await postRequest<LoginRequest>({
        path: API_LOGIN.buildUrlPath(),
        data,
      })) as LoginResponse;
    },
  });
}
