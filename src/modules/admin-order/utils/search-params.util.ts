import { EOrderStatus, EOrderType } from "@common/models/order/order-model";
import { createParser, parseAsArrayOf, parseAsIsoDate, parseAsString } from "nuqs";

import { SearchParams } from "@/shared/enums";

export const isValidOrderType = (type: string): type is EOrderType => {
  const validOrderTypes = Object.values(EOrderType);
  return validOrderTypes.includes(type as EOrderType);
};

export const parseAsOrderType = createParser({
  parse: (queryValue) => {
    if (!isValidOrderType(queryValue)) {
      return null;
    }
    return queryValue;
  },
  serialize: (value) => {
    return value;
  },
});

export const isValidOrderStatus = (status: string): status is EOrderStatus => {
  const validOrderStatuses = Object.values(EOrderStatus);
  return validOrderStatuses.includes(status as EOrderStatus);
};

export const parseAsOrderStatus = createParser({
  parse: (queryValue) => {
    if (!isValidOrderStatus(queryValue)) {
      return null;
    }
    return queryValue;
  },
  serialize: (value) => {
    return value;
  },
});

export const ORDERS_SEARCH_PARAMS = {
  [SearchParams.Query]: parseAsString.withDefault(""),
  [SearchParams.Type]: parseAsArrayOf(parseAsOrderType).withDefault([]),
  [SearchParams.Status]: parseAsArrayOf(parseAsOrderStatus).withDefault([]),
  [SearchParams.Channel]: parseAsString.withDefault(""),
  [SearchParams.From]: parseAsIsoDate,
  [SearchParams.To]: parseAsIsoDate,
};
