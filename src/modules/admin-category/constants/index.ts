import { EProductType } from "@common/models/category";

export const FILTER_TABS: { label: string; type: EProductType }[] = [
  { label: "Drinks", type: EProductType.DRINK },
  { label: "Products", type: EProductType.PACKAGED },
];
