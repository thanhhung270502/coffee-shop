"use client";

import { OrderObject } from "@common/models/order";
import Link from "next/link";

import { Button } from "@/shared";
import { ClientRoutes } from "@/shared/constants";
import { getDetailRoute } from "@/shared/utils/routes.util";

type OrderNumberProps = {
  order: OrderObject;
};

export const OrderNumber = ({ order }: OrderNumberProps) => {
  return (
    <Link
      href={getDetailRoute(ClientRoutes.AdminOrderDetail, order.id)}
      className="text-brand-tertiary hover:underline"
    >
      <Button variant="link">{order.orderNumber}</Button>
    </Link>
  );
};
