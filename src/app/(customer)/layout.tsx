import { CustomerShellLayout } from "@/modules/customer/layouts";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return <CustomerShellLayout>{children}</CustomerShellLayout>;
}
