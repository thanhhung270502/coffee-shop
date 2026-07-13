import type { EReportGroupBy } from "@common/models/report";
import { createParser, parseAsIsoDate } from "nuqs";

import { SearchParams } from "@/shared/enums";

import { DEFAULT_GROUP_BY } from "../constants";

const VALID_GROUP_BY: EReportGroupBy[] = ["day", "week", "month"];

export const isValidReportGroupBy = (value: string): value is EReportGroupBy => {
  return VALID_GROUP_BY.includes(value as EReportGroupBy);
};

export const parseAsReportGroupBy = createParser({
  parse: (queryValue) => {
    if (!isValidReportGroupBy(queryValue)) {
      return null;
    }
    return queryValue;
  },
  serialize: (value) => value,
});

export const REPORTS_SEARCH_PARAMS = {
  [SearchParams.From]: parseAsIsoDate,
  [SearchParams.To]: parseAsIsoDate,
  [SearchParams.GroupBy]: parseAsReportGroupBy.withDefault(DEFAULT_GROUP_BY),
};
