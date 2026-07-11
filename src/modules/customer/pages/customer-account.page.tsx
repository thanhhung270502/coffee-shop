"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button, Card, CardContent, Separator, Skeleton, Typography } from "@/shared/components";
import { useLogoutMutation } from "@/shared/mutations";
import { useQueryMe } from "@/shared/queries";

export function CustomerAccountPage() {
  const { data, isLoading } = useQueryMe();
  const logout = useLogoutMutation();
  const router = useRouter();
  const user = data?.user;

  const handleSignOut = async () => {
    await logout.mutateAsync();
    router.push("/auth");
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Skeleton className="h-8 w-36 rounded-lg" />
        <Card>
          <CardContent className="space-y-3">
            <Skeleton className="h-5 w-48 rounded" />
            <Skeleton className="h-5 w-56 rounded" />
            <Skeleton className="h-5 w-40 rounded" />
          </CardContent>
        </Card>
        <Skeleton className="h-10 w-44 rounded-lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md space-y-4 text-center">
        <Typography variant="heading-md">Account</Typography>
        <Typography variant="body-md" color="secondary">
          Sign in to view your account and order history.
        </Typography>
        <Link href="/auth">
          <Button variant="primary">Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Typography variant="heading-md">My Account</Typography>

      <Card>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Typography variant="heading-sm">Profile</Typography>
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex gap-2">
              <Typography variant="body-sm" color="secondary" className="w-20 shrink-0">
                Name
              </Typography>
              <Typography variant="body-sm">{user.name ?? "—"}</Typography>
            </div>
            <div className="flex gap-2">
              <Typography variant="body-sm" color="secondary" className="w-20 shrink-0">
                Email
              </Typography>
              <Typography variant="body-sm">{user.email}</Typography>
            </div>
            <div className="flex gap-2">
              <Typography variant="body-sm" color="secondary" className="w-20 shrink-0">
                Phone
              </Typography>
              <Typography variant="body-sm">{user.phone ?? "—"}</Typography>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Link href="/account/orders">
          <Button variant="secondary-gray">View Order History</Button>
        </Link>
        <Button variant="destructive-secondary" onClick={handleSignOut} loading={logout.isPending}>
          Sign Out
        </Button>
      </div>
    </div>
  );
}
