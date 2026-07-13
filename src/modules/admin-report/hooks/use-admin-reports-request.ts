"use client";

import type { EReportGroupBy } from "@common/models/report";
import { useQueryStates } from "nuqs";

import { SearchParams } from "@/shared/enums";
import { toYYYYMMDD } from "@/shared/utils/date.util";

import { DEFAULT_DATE_RANGE, DEFAULT_GROUP_BY } from "../constants";
import { REPORTS_SEARCH_PARAMS } from "../utils/search-params.util";

export const useAdminReportsRequest = () => {
  const [{ from, to, groupBy }, setRequest] = useQueryStates(REPORTS_SEARCH_PARAMS);

  const onFromChange = (date: Date | null) => {
    setRequest({ [SearchParams.From]: date });
  };

  const onToChange = (date: Date | null) => {
    setRequest({ [SearchParams.To]: date });
  };

  const onGroupByChange = (value: EReportGroupBy) => {
    setRequest({ [SearchParams.GroupBy]: value });
  };

  const fromIso = toYYYYMMDD(from ?? DEFAULT_DATE_RANGE.from);
  const toIso = toYYYYMMDD(to ?? DEFAULT_DATE_RANGE.to);

  const isFiltering =
    fromIso !== DEFAULT_DATE_RANGE.from ||
    toIso !== DEFAULT_DATE_RANGE.to ||
    groupBy !== DEFAULT_GROUP_BY;

  return {
    from,
    to,
    groupBy,
    fromIso,
    toIso,
    onFromChange,
    onToChange,
    onGroupByChange,
    setRequest,
    isFiltering,
  };
};
export type UseAdminReportsRequestReturn = ReturnType<typeof useAdminReportsRequest>;
