import type { Metadata } from "next";

import { CustomerHomePage } from "@/modules/customer-home/pages";

export const metadata: Metadata = {
  title: "Coffee Shop — Order Online",
  description: "Order fresh drinks for pickup or delivery. Shop packaged coffee products.",
};

export default function Page() {
  return <CustomerHomePage />;
}
