"use client";

import { EOrderStatus } from "@common/models/order";

import { Badge, Typography } from "@/shared/components";

const STATUS_STEPS = [
  EOrderStatus.PENDING,
  EOrderStatus.CONFIRMED,
  EOrderStatus.PREPARING,
  EOrderStatus.READY,
  EOrderStatus.COMPLETED,
] as const;

const STATUS_LABELS: Record<EOrderStatus, string> = {
  [EOrderStatus.PENDING]: "Pending",
  [EOrderStatus.CONFIRMED]: "Confirmed",
  [EOrderStatus.PREPARING]: "Preparing",
  [EOrderStatus.READY]: "Ready",
  [EOrderStatus.COMPLETED]: "Completed",
  [EOrderStatus.CANCELLED]: "Cancelled",
};

function getStatusVariant(status: EOrderStatus): "default" | "success" | "warning" | "danger" {
  switch (status) {
    case EOrderStatus.PENDING:
      return "warning";
    case EOrderStatus.CONFIRMED:
    case EOrderStatus.PREPARING:
      return "default";
    case EOrderStatus.READY:
      return "success";
    case EOrderStatus.COMPLETED:
      return "success";
    case EOrderStatus.CANCELLED:
      return "danger";
    default:
      return "default";
  }
}

type OrderStatusTimelineProps = {
  status: EOrderStatus;
};

export function OrderStatusTimeline({ status }: OrderStatusTimelineProps) {
  if (status === EOrderStatus.CANCELLED) {
    return (
      <div className="space-y-2">
        <Badge variant="danger">Cancelled</Badge>
        <Typography variant="body-sm" color="secondary">
          This order has been cancelled.
        </Typography>
      </div>
    );
  }

  const currentIndex = STATUS_STEPS.indexOf(status as (typeof STATUS_STEPS)[number]);

  return (
    <div className="space-y-4">
      <Badge variant={getStatusVariant(status)}>{STATUS_LABELS[status]}</Badge>
      <ol className="space-y-3">
        {STATUS_STEPS.map((step, index) => {
          const isActive = index <= currentIndex;
          return (
            <li key={step} className="flex items-center gap-3">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                  isActive ? "bg-brand-main text-white" : "bg-zinc-200 text-zinc-500"
                }`}
              >
                {index + 1}
              </span>
              <Typography variant="body-md" color={isActive ? "primary" : "secondary"}>
                {STATUS_LABELS[step]}
              </Typography>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
