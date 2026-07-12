"use client";

import { Record, Warning2 } from "iconsax-reactjs";
import { Toaster } from "sonner";

import { cn } from "@/shared/utils/cn.util";

import { CheckIcon, CloseIcon } from "./external-icons";

const ICON_SIZE = "1.25rem";

export function CustomToaster() {
  const baseClasses =
    "rounded-4xl border border-primary shadow-sm px-2xl py-lg flex items-center gap-md body-md font-semibold";

  return (
    <>
      <Toaster
        icons={{
          success: <CheckIcon size={ICON_SIZE} className="text-success-primary" />,
          error: <CloseIcon size={ICON_SIZE} className="text-error-primary" />,
          warning: <Warning2 size={ICON_SIZE} className="text-warning-primary" />,
          info: <Record size={ICON_SIZE} className="text-primary" />,
        }}
        toastOptions={{
          unstyled: true,
          duration: 3_000,
          classNames: {
            success: cn(
              baseClasses,
              "border-success-subtle bg-success-primary text-success-primary"
            ),
            error: cn(baseClasses, "border-error-subtle bg-error-primary text-error-primary"),
            warning: cn(
              baseClasses,
              "border-warning-subtle bg-warning-primary text-warning-primary"
            ),
            info: cn(baseClasses, "border-secondary bg-secondary text-primary"),
          },
        }}
        position="top-right"
      />
    </>
  );
}
