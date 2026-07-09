"use client";

import type { BaseSyntheticEvent } from "react";
import { useCallback } from "react";
import type {
  FieldErrors,
  FieldValues,
  SubmitErrorHandler,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";
import { FormProvider as ReactHookFormProvider } from "react-hook-form";

import { IS_LOCAL } from "../constants/env.constant";

type FormProviderProps<T extends FieldValues> = {
  children: React.ReactNode;
  formMethods: UseFormReturn<T>;
  onSubmit: SubmitHandler<T> | ((e?: BaseSyntheticEvent) => Promise<void>);
  onError?: SubmitErrorHandler<T>;
  className?: string;
};

export const FormProvider = <T extends FieldValues>({
  children,
  formMethods,
  onSubmit,
  onError,
  className,
}: FormProviderProps<T>) => {
  const handleError = useCallback(
    (errors: FieldErrors<T>) => {
      if (IS_LOCAL) {
        console.error(`[FormProvider] Validation errors:`, errors);
      }
      onError?.(errors);
    },
    [onError]
  );

  const handleSubmit = useCallback(
    (e: BaseSyntheticEvent) => {
      e.preventDefault();
      e.stopPropagation();
      formMethods.handleSubmit(onSubmit as SubmitHandler<T>, handleError)(e);
    },
    [formMethods, onSubmit, handleError]
  );

  return (
    <ReactHookFormProvider {...formMethods}>
      <form onSubmit={handleSubmit} className={className}>
        {children}
      </form>
    </ReactHookFormProvider>
  );
};
