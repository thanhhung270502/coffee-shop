"use client";

import { SidebarProvider } from "@/shared/components";
import { AdminSidebar } from "@/shared/components/sidebar/admin-sidebar";

import { AdminHeader } from "../components/admin-header";

type AdminShellLayoutProps = {
  children: React.ReactNode;
};

export function AdminShellLayout({ children }: AdminShellLayoutProps) {
  return (
    <SidebarProvider defaultOpen>
      <AdminSidebar />
      <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}
