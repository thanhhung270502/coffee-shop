"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LogoutCurve } from "iconsax-reactjs";
import { useRouter } from "next/navigation";

import { Button } from "@/shared/components/button";
import { Typography } from "@/shared/components/typography";
import { useLogoutMutation } from "@/shared/mutations";
import { useQueryMe } from "@/shared/queries";
import { ME_QUERY_KEY } from "@/shared/queries/use-query-me";

type PosHeaderProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

const TABS = [
  { id: "sell", label: "Sell" },
  { id: "queue", label: "Kitchen Queue" },
  { id: "online", label: "Online Orders" },
] as const;

export function PosHeader({ activeTab, onTabChange }: PosHeaderProps) {
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
    hour12: false,
  });

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    queryClient.removeQueries({ queryKey: ME_QUERY_KEY });
    router.push("/auth");
  };

  const staffName = meData?.user?.name ?? meData?.user?.email ?? "Staff";

  return (
    <header className="flex h-14 shrink-0 items-center gap-0 border-b border-zinc-200 bg-white">
      {/* Logo */}
      <div className="flex items-center gap-2 border-r border-zinc-200 px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-600">
          <Typography variant="body-xs" className="font-bold text-white">
            POS
          </Typography>
        </div>
        <Typography variant="body-sm" className="hidden font-bold sm:block">
          Coffee Shop
        </Typography>
      </div>

      {/* Tabs */}
      <nav className="flex h-full items-end px-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`relative flex h-full items-center px-4 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "text-amber-600"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-amber-600" />
            )}
          </button>
        ))}
      </nav>

      <div className="flex-1" />

      {/* Clock */}
      <Typography variant="body-sm" className="hidden font-mono font-semibold lg:block">
        {formatted}
      </Typography>

      {/* User + Logout */}
      <div className="flex items-center gap-2 border-l border-zinc-200 px-4">
        <Typography variant="body-sm" color="secondary" className="hidden sm:block">
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
    </header>
  );
}
