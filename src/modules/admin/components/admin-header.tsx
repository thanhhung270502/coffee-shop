"use client";

import { useQueryClient } from "@tanstack/react-query";
import { LogoutCurve } from "iconsax-reactjs";
import { useRouter } from "next/navigation";

import { Button } from "@/shared/components/button";
import { PageTitle } from "@/shared/components/page-title";
import { Typography } from "@/shared/components/typography";
import { useLogoutMutation } from "@/shared/mutations";
import { useQueryMe } from "@/shared/queries";
import { ME_QUERY_KEY } from "@/shared/queries/use-query-me";

export function AdminHeader() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data } = useQueryMe();
  const logoutMutation = useLogoutMutation();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    queryClient.removeQueries({ queryKey: ME_QUERY_KEY });
    router.push("/auth");
  };

  return (
    <header className="border-primary flex h-20 items-center justify-between border-b bg-white px-6">
      <PageTitle />
      {/* <Typography variant="heading-sm" weight="semibold">
        Coffee Shop Admin
      </Typography> */}

      <div className="flex items-center gap-4">
        {data?.user && (
          <Typography variant="body-sm" color="secondary">
            {data.user.name ?? data.user.email}
          </Typography>
        )}
        <Button
          variant="secondary-gray"
          size="sm"
          startIcon={LogoutCurve}
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          Log out
        </Button>
      </div>
    </header>
  );
}
