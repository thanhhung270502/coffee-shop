"use client";

import Link from "next/link";

import { Button, Card, CardContent, Typography } from "@/shared/components";
import { useQueryMe } from "@/shared/queries";

export function CustomerAccountPage() {
  const { data, isLoading } = useQueryMe();
  const user = data?.user;

  if (isLoading) {
    return <Typography variant="body-md">Loading...</Typography>;
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
        <CardContent className="space-y-2">
          <Typography variant="body-md">
            <span className="font-medium">Name:</span> {user.name ?? "—"}
          </Typography>
          <Typography variant="body-md">
            <span className="font-medium">Email:</span> {user.email}
          </Typography>
          <Typography variant="body-md">
            <span className="font-medium">Phone:</span> {user.phone ?? "—"}
          </Typography>
        </CardContent>
      </Card>

      <Link href="/account/orders">
        <Button variant="secondary-gray">View Order History</Button>
      </Link>
    </div>
  );
}
