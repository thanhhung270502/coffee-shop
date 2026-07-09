"use client";

import type { RegisterRequest, RegisterResponse } from "@common/models/auth";
import { API_REGISTER } from "@common/models/auth";
import { useMutation } from "@tanstack/react-query";

import { postRequest } from "@/libs/api-client";

export function useRegisterMutation() {
  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      return (await postRequest<RegisterRequest>({
        path: API_REGISTER.buildUrlPath(),
        data,
      })) as RegisterResponse;
    },
  });
}
