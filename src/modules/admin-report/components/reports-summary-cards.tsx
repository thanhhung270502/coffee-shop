"use client";

import { Card } from "@/shared/components/card";
import { Skeleton } from "@/shared/components/skeleton";
import { Typography } from "@/shared/components/typography";
import { formatCurrency } from "@/shared/utils/currency.util";

type ReportsSummaryCardsProps = {
  totalRevenue: number;
  totalOrders: number;
  isLoading: boolean;
};

export const ReportsSummaryCards = ({
  totalRevenue,
  totalOrders,
  isLoading,
}: ReportsSummaryCardsProps) => {
  return (
    <div className="gap-4xl grid sm:grid-cols-2">
      <Card className="p-4xl">
        <Typography variant="body-sm" color="secondary">
          Total Revenue
        </Typography>
        {isLoading ? (
          <Skeleton className="mt-md h-8 w-32" />
        ) : (
          <Typography variant="heading-md" weight="semibold" className="mt-md">
            {formatCurrency(totalRevenue)}
          </Typography>
        )}
      </Card>
      <Card className="p-4xl">
        <Typography variant="body-sm" color="secondary">
          Total Orders
        </Typography>
        {isLoading ? (
          <Skeleton className="mt-md h-8 w-16" />
        ) : (
          <Typography variant="heading-md" weight="semibold" className="mt-md">
            {totalOrders}
          </Typography>
        )}
      </Card>
    </div>
  );
};
