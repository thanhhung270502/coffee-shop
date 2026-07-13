import { createParser, parseAsString } from "nuqs";

import { SearchParams } from "@/shared/enums";

import type { StaffStatusFilter } from "../constants";

const VALID_STATUSES: StaffStatusFilter[] = ["", "active", "inactive"];

export const parseAsStaffStatus = createParser({
  parse: (value) => {
    return VALID_STATUSES.includes(value as StaffStatusFilter) ? (value as StaffStatusFilter) : null;
  },
  serialize: (value) => value,
});

export const STAFF_SEARCH_PARAMS = {
  [SearchParams.Query]: parseAsString.withDefault(""),
  [SearchParams.Status]: parseAsStaffStatus.withDefault("" as StaffStatusFilter),
};
