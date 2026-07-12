import { useMemo } from "react";
import { EOrderStatus, OrderObject } from "@common/models/order";

import { Badge } from "@/shared/components/badge";

import { STATUS_LABELS } from "../constants";

type OrderStatusProps = {
  order: OrderObject;
};

export const OrderStatus = ({ order }: OrderStatusProps) => {
  const variant = useMemo(() => {
    if (order.status === EOrderStatus.PENDING) return "default";
    if (order.status === EOrderStatus.CONFIRMED) return "success";
    if (order.status === EOrderStatus.PREPARING) return "warning";
    if (order.status === EOrderStatus.READY) return "success";
    if (order.status === EOrderStatus.COMPLETED) return "success";
    if (order.status === EOrderStatus.CANCELLED) return "danger";
  }, [order.status]);

  return <Badge variant={variant}>{STATUS_LABELS[order.status] ?? order.status}</Badge>;
};
