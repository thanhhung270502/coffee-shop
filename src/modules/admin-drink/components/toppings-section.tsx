"use client";

import { Badge } from "@/shared/components/badge";
import { Button } from "@/shared/components/button";
import { Typography } from "@/shared/components/typography";
import {
  useDeleteToppingMutation,
  useUpdateToppingMutation,
} from "@/shared/mutations/use-admin-topping-mutations";
import { useQueryAdminToppings } from "@/shared/queries/use-query-admin-toppings";
import { formatCurrency } from "@/shared/utils/currency.util";

import { useToppingForm } from "../hooks/use-topping-form";

import { ToppingForm } from "./topping-form";

export const ToppingsSection = () => {
  const { data: toppingsData } = useQueryAdminToppings();
  const updateToppingMutation = useUpdateToppingMutation();
  const deleteToppingMutation = useDeleteToppingMutation();
  const toppingForm = useToppingForm();

  const toppings = toppingsData?.toppings ?? [];

  return (
    <div className="p-3xl md:p-4xl gap-3xl flex flex-col rounded-xl bg-white">
      <Typography variant="heading-sm" weight="semibold">
        Manage Toppings
      </Typography>
      <ToppingForm
        methods={toppingForm.methods}
        onSubmit={toppingForm.onSubmit}
        isSubmitting={toppingForm.isSubmitting}
      />
      <div className="flex flex-wrap gap-2">
        {toppings.map((t) => (
          <Badge key={t.id} variant={t.isActive ? "success" : "default"}>
            {t.name} — {formatCurrency(t.price)}
            <Button
              type="button"
              variant="link-gray"
              size="xs"
              className="ml-1"
              onClick={() =>
                updateToppingMutation.mutate({ id: t.id, data: { isActive: !t.isActive } })
              }
              disabled={updateToppingMutation.isPending}
            >
              {t.isActive ? "Disable" : "Enable"}
            </Button>
            <Button
              type="button"
              variant="destructive-link"
              size="xs"
              className="ml-1"
              onClick={() => deleteToppingMutation.mutate(t.id)}
              disabled={deleteToppingMutation.isPending}
            >
              Delete
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
};
