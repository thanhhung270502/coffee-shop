import { Filter } from "iconsax-reactjs";

import { Button } from "@/shared/components/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/popover";
import { cn } from "@/shared/utils";

import { useAdminOrdersFilter } from "../hooks/use-admin-orders-filter";
import { UseAdminOrdersRequestReturn } from "../hooks/use-admin-orders-request";

import { OrderToolbarFilterContent } from "./order-toolbar-filter-content";

type OrdersToolbarFilterProps = UseAdminOrdersRequestReturn;

export const OrdersToolbarFilter = (props: OrdersToolbarFilterProps) => {
  const { isFiltering } = props;
  const adminOrdersFilterForm = useAdminOrdersFilter(props);
  const { open, setOpen } = adminOrdersFilterForm;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant={isFiltering ? "primary" : "secondary-gray"} size="sm" startIcon={Filter}>
            Filter
          </Button>
        }
      />
      <PopoverContent
        side="bottom"
        align="start"
        popupClassName={cn(
          "rounded-2xl bg-white shadow-2xl flex flex-col overflow-auto",
          "w-80 max-h-[40vh]"
        )}
      >
        <OrderToolbarFilterContent {...adminOrdersFilterForm} />
      </PopoverContent>
    </Popover>
  );
};
