"use client";

import { Card } from "@/shared/components/card";
import { Skeleton } from "@/shared/components/skeleton";
import { Typography } from "@/shared/components/typography";
import { formatCurrency } from "@/shared/utils/currency.util";

type DashboardSummaryCardsProps = {
  revenueToday: number;
  ordersToday: number;
  pendingOrders: number;
  isLoading: boolean;
};

export const DashboardSummaryCards = ({
  revenueToday,
  ordersToday,
  pendingOrders,
  isLoading,
}: DashboardSummaryCardsProps) => {
  return (
    <div className="gap-4xl grid sm:grid-cols-3">
      <Card className="p-4xl">
        <Typography variant="body-sm" color="secondary">
          Revenue Today
        </Typography>
        {isLoading ? (
          <Skeleton className="mt-md h-8 w-32" />
        ) : (
          <Typography variant="heading-md" weight="semibold" className="mt-md">
            {formatCurrency(revenueToday)}
          </Typography>
        )}
      </Card>
      <Card className="p-4xl">
        <Typography variant="body-sm" color="secondary">
          Orders Today
        </Typography>
        {isLoading ? (
          <Skeleton className="mt-md h-8 w-16" />
        ) : (
          <Typography variant="heading-md" weight="semibold" className="mt-md">
            {ordersToday}
          </Typography>
        )}
      </Card>
      <Card className="p-4xl">
        <Typography variant="body-sm" color="secondary">
          Pending Orders
        </Typography>
        {isLoading ? (
          <Skeleton className="mt-md h-8 w-16" />
        ) : (
          <Typography variant="heading-md" weight="semibold" className="mt-md">
            {pendingOrders}
          </Typography>
        )}
      </Card>
    </div>
  );
};
