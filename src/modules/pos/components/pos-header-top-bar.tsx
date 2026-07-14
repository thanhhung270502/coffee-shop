"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LogoutCurve } from "iconsax-reactjs";
import { useRouter } from "next/navigation";

import { Button, Typography } from "@/shared/components";
import { useLogoutMutation } from "@/shared/mutations";
import { useQueryMe } from "@/shared/queries";
import { ME_QUERY_KEY } from "@/shared/queries/use-query-me";
import { cn } from "@/shared/utils/cn.util";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function PosHeaderTopBar() {
  const [time, setTime] = useState(() => new Date());
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: meData } = useQueryMe();
  const logoutMutation = useLogoutMutation();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatted = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    queryClient.removeQueries({ queryKey: ME_QUERY_KEY });
    router.push("/auth");
  };

  const staffName = meData?.user?.name ?? meData?.user?.email ?? "Staff";

  return (
    <div className="flex h-14 shrink-0 items-center gap-3 border-b border-neutral-200 bg-white px-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-main">
          <Typography variant="body-xs" className="font-bold text-white">
            POS
          </Typography>
        </div>
        <Typography variant="body-sm" className="hidden font-bold sm:block">
          Coffee Shop
        </Typography>
      </div>

      <div className="mx-auto hidden lg:block">
        <div className="rounded-full bg-success-50 px-4 py-1.5">
          <Typography variant="body-sm" className="font-mono font-semibold text-success-700">
            {formatted}
          </Typography>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary-subtle",
            "text-brand-main text-xs font-semibold",
          )}
          aria-hidden
        >
          {getInitials(staffName)}
        </div>
        <Typography variant="body-sm" color="secondary" className="hidden max-w-32 truncate sm:block">
          {staffName}
        </Typography>
        <Button
          variant="secondary-gray"
          size="sm"
          startIcon={LogoutCurve}
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          aria-label="Logout"
        >
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </div>
  );
}
