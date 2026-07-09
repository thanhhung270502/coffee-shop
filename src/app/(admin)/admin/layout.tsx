import { requireRoleOrRedirect } from "@/libs/auth/guards";
import { AdminShellLayout } from "@/modules/admin/layouts";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRoleOrRedirect(["ADMIN"]);

  return <AdminShellLayout>{children}</AdminShellLayout>;
}
