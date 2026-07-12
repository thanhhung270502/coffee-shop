import { EOrderChannel, EOrderStatus, EOrderType } from "@common/models/order";

import { Button, cn, FormProvider, RHFSelect } from "@/shared";
import { useSmaller } from "@/shared/hooks";

import { UseAdminOrdersFilterReturn } from "../hooks/use-admin-orders-filter";

const ORDER_TYPE_OPTIONS = Object.values(EOrderType).map((type) => ({
  label: type,
  value: type,
}));

const ORDER_STATUS_OPTIONS = Object.values(EOrderStatus).map((status) => ({
  label: status,
  value: status,
}));

const CHANNEL_OPTIONS = Object.values(EOrderChannel).map((channel) => ({
  label: channel,
  value: channel,
}));

type OrderToolbarFilterContentProps = UseAdminOrdersFilterReturn;

export const OrderToolbarFilterContent = ({
  methods,
  onSubmit,
  setOpen,
  onReset,
}: OrderToolbarFilterContentProps) => {
  const isMobile = useSmaller("sm");
  const handleClose = () => setOpen(false);
  return (
    <FormProvider formMethods={methods} onSubmit={onSubmit}>
      <div className="gap-2xl p-2xl flex flex-col">
        <RHFSelect
          name="type"
          control={methods.control}
          options={ORDER_TYPE_OPTIONS}
          isMulti
          size="sm"
          label="Type"
        />
        <RHFSelect
          name="status"
          control={methods.control}
          options={ORDER_STATUS_OPTIONS}
          isMulti
          size="sm"
          label="Status"
          isClearable
        />
        <RHFSelect
          label="Channel"
          name="channel"
          control={methods.control}
          options={CHANNEL_OPTIONS}
          isClearable
          size="sm"
        />
      </div>
      <div
        className={cn(
          "gap-lg p-2xl border-secondary flex justify-start border-t",
          isMobile ? "flex-col" : "flex-row"
        )}
      >
        <Button variant="primary" size="sm" type="submit">
          Save
        </Button>
        <Button variant="secondary-gray" size="sm" type="button" onClick={handleClose}>
          Close
        </Button>
        <Button variant="tertiary-gray" size="sm" type="button" onClick={onReset}>
          Reset
        </Button>
      </div>
    </FormProvider>
  );
};
