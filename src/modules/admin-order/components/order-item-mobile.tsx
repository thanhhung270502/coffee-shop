"use client";

import { useMemo } from "react";
import { OrderObject } from "@common/models/order";

import { Typography } from "@/shared/components/typography";
import { formatCurrency } from "@/shared/utils/currency.util";

import { STATUS_LABELS } from "../constants";

import { OrderNumber } from "./order-number";

const LABEL_WIDTH = "basis-[7.5rem] shrink-0";

type OrderItemMobileProps = {
  order: OrderObject;
};

export const OrderItemMobile = ({ order }: OrderItemMobileProps) => {
  const fields = useMemo(() => {
    return [
      {
        label: "Customer",
        value: (
          <Typography variant="body-md" className="text-wrap break-all">
            {order.customerName}
          </Typography>
        ),
      },
      { label: "Phone", value: <Typography>{order.customerPhone}</Typography> },
      {
        label: "Type",
        value: <Typography>{order.type === "DRINK_ORDER" ? "Drink" : "Product"}</Typography>,
      },
      { label: "Channel", value: <Typography>{order.channel}</Typography> },
      { label: "Total", value: <Typography>{formatCurrency(order.total)}</Typography> },
      {
        label: "Status",
        value: <Typography>{STATUS_LABELS[order.status] ?? order.status}</Typography>,
      },
    ];
  }, [order]);

  return (
    <div className="gap-lg py-2xl px-3xl flex flex-col rounded-lg bg-white shadow-xs">
      <div className="gap-2xl border-secondary pb-lg flex items-center border-b">
        <OrderNumber order={order} />
      </div>

      <div className="gap-md flex flex-col">
        <div className="gap-md flex flex-col">
          {fields.map((item) => (
            <div key={item.label} className="gap-xl flex items-center">
              <Typography variant="body-md" weight="medium" className={LABEL_WIDTH}>
                {item.label}
              </Typography>
              {item.value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
