"use client";

import { AdminHeader } from "../components/admin-header";
import { AdminSidebar, useAdminSidebar } from "../components/admin-sidebar";

type AdminShellLayoutProps = {
  children: React.ReactNode;
};

export function AdminShellLayout({ children }: AdminShellLayoutProps) {
  const { collapsed, toggle } = useAdminSidebar();

  return (
    <div className="flex min-h-screen bg-primary">
      <AdminSidebar collapsed={collapsed} onToggle={toggle} />
      <div className="flex min-h-screen flex-1 flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
