"use client";

import { Button } from "@/shared/components/button";
import { DateInput } from "@/shared/components/date-input";

import { GROUP_BY_OPTIONS } from "../constants";
import type { UseAdminReportsRequestReturn } from "../hooks/use-admin-reports-request";
import type { UseExportOrdersReturn } from "../hooks/use-export-orders";

type ReportsToolbarProps = Pick<
  UseAdminReportsRequestReturn,
  "from" | "to" | "groupBy" | "onFromChange" | "onToChange" | "onGroupByChange"
> &
  Pick<UseExportOrdersReturn, "isExporting" | "handleExport">;

export const ReportsToolbar = ({
  from,
  to,
  groupBy,
  onFromChange,
  onToChange,
  onGroupByChange,
  isExporting,
  handleExport,
}: ReportsToolbarProps) => {
  return (
    <div className="gap-4xl flex flex-wrap items-end">
      <DateInput
        label="From"
        value={from}
        onChange={onFromChange}
        maxDate={to}
        size="sm"
      />
      <DateInput
        label="To"
        value={to}
        onChange={onToChange}
        minDate={from}
        size="sm"
      />
      <div className="gap-md flex">
        {GROUP_BY_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            type="button"
            variant={groupBy === opt.value ? "primary" : "secondary-gray"}
            size="sm"
            onClick={() => onGroupByChange(opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </div>
      <Button
        type="button"
        variant="secondary-color"
        size="sm"
        onClick={handleExport}
        loading={isExporting}
      >
        Export CSV
      </Button>
    </div>
  );
};
