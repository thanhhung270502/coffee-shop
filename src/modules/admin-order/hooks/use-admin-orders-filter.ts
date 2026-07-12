"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { EOrderStatus, EOrderType } from "@common/models/order";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { SearchParams } from "@/shared/enums";

import { UseAdminOrdersRequestReturn } from "./use-admin-orders-request";

const filterSchema = z.object({
  type: z.array(z.enum(EOrderType)),
  status: z.array(z.enum(EOrderStatus)),
  channel: z.string().nullable(),
  from: z.date().nullable(),
  to: z.date().nullable(),
});
export type AdminOrdersFilterFormData = z.infer<typeof filterSchema>;

const defaultValues: AdminOrdersFilterFormData = {
  type: [],
  status: [],
  channel: null,
  from: null,
  to: null,
};

type UseAdminOrdersFilterProps = UseAdminOrdersRequestReturn;
export const useAdminOrdersFilter = ({
  type,
  status,
  channel,
  from,
  to,
  setAdminOrdersRequest,
}: UseAdminOrdersFilterProps) => {
  const [open, setOpen] = useState(false);
  const methods = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues,
  });

  const onSubmit = methods.handleSubmit((data) => {
    setAdminOrdersRequest({
      [SearchParams.Type]: data.type,
      [SearchParams.Status]: data.status,
      [SearchParams.Channel]: data.channel,
      [SearchParams.From]: data.from,
      [SearchParams.To]: data.to,
    });
    setOpen(false);
  });

  const onReset = () => {
    setAdminOrdersRequest({
      [SearchParams.Type]: null,
      [SearchParams.Status]: null,
      [SearchParams.Channel]: null,
      [SearchParams.From]: null,
      [SearchParams.To]: null,
    });
    setOpen(false);
  };

  useEffect(() => {
    methods.reset({
      type,
      status,
      channel,
      from,
      to,
    });
  }, [type, status, channel, from, to, methods]);

  return {
    open,
    setOpen,
    methods,
    onSubmit,
    onReset,
  };
};
export type UseAdminOrdersFilterReturn = ReturnType<typeof useAdminOrdersFilter>;
