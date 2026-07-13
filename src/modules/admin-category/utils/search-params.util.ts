import { EProductType } from "@common/models/category";
import { createParser, parseAsString } from "nuqs";

import { SearchParams } from "@/shared/enums";

export const parseAsProductType = createParser({
  parse: (value) => {
    const valid = Object.values(EProductType);
    return valid.includes(value as EProductType) ? (value as EProductType) : null;
  },
  serialize: (value) => value,
});

export const CATEGORIES_SEARCH_PARAMS = {
  [SearchParams.Query]: parseAsString.withDefault(""),
  [SearchParams.Type]: parseAsProductType.withDefault(EProductType.DRINK),
};
