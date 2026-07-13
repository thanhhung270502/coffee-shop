import type { DrinkObject } from "@common/models/product";

import { Badge } from "@/shared/components/badge";

type DrinkStatusProps = {
  drink: DrinkObject;
};

export const DrinkStatus = ({ drink }: DrinkStatusProps) => (
  <Badge variant={drink.isActive ? "success" : "default"}>
    {drink.isActive ? "Active" : "Inactive"}
  </Badge>
);
