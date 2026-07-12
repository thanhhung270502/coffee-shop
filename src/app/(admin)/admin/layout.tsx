import { requireRoleOrRedirect } from "@/libs/auth/guards";
import { AdminHeader } from "@/modules/admin/components/admin-header";
import { AppContent } from "@/shared/components/app-content";
import { AdminSidebar } from "@/shared/components/sidebar/admin-sidebar";
import { SidebarInset, SidebarProvider } from "@/shared/components/sidebar/sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRoleOrRedirect(["ADMIN"]);

  return (
    <SidebarProvider defaultOpen>
      <AdminSidebar />
      <SidebarInset>
        <AdminHeader />
        <AppContent>{children}</AppContent>
      </SidebarInset>
    </SidebarProvider>
  );
}
