import { parseAsString } from "nuqs";

import { SearchParams } from "@/shared/enums";

export const DRINKS_SEARCH_PARAMS = {
  [SearchParams.Query]: parseAsString.withDefault(""),
  [SearchParams.CategoryId]: parseAsString.withDefault(""),
};
