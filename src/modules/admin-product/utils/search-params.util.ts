import { parseAsString } from "nuqs";

import { SearchParams } from "@/shared/enums";

export const PRODUCTS_SEARCH_PARAMS = {
  [SearchParams.Query]: parseAsString.withDefault(""),
  [SearchParams.CategoryId]: parseAsString.withDefault(""),
};
