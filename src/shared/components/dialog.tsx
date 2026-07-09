"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/shared/utils/cn.util";

import { Button } from "./button";

export type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  className?: string;
};

export function Dialog({ open, onOpenChange, title, children, className }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        "w-full max-w-lg rounded-lg border border-zinc-200 bg-white p-0 shadow-xl backdrop:bg-black/50 dark:border-zinc-800 dark:bg-zinc-950",
        className,
      )}
      onClose={() => onOpenChange(false)}
    >
      <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{title}</h2>
        <Button variant="outlined-gray" size="sm" onClick={() => onOpenChange(false)}>
          Đóng
        </Button>
      </div>
      <div className="px-6 py-4">{children}</div>
    </dialog>
  );
}
