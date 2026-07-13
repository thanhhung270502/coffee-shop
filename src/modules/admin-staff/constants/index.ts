export type StaffStatusFilter = "" | "active" | "inactive";

export const STATUS_TABS: { label: string; status: StaffStatusFilter }[] = [
  { label: "All", status: "" },
  { label: "Active", status: "active" },
  { label: "Inactive", status: "inactive" },
];
