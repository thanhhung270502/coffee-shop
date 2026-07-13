"use client";

import { PageHeader } from "@/shared/components/page-header";
import { useSmaller } from "@/shared/hooks";

import { StaffFormDialog, StaffMobile, StaffTable, StaffToolbar } from "../components";
import { useAdminStaff } from "../hooks/use-admin-staff";
import { useStaffForm } from "../hooks/use-staff-form";

export const AdminStaffPage = () => {
  const isMobile = useSmaller("sm");
  const hook = useAdminStaff();
  const formHook = useStaffForm();

  const List = isMobile ? StaffMobile : StaffTable;

  return (
    <div className="gap-4xl flex flex-col">
      <PageHeader
        title="Staff"
        description="Manage POS staff accounts"
        action={<StaffFormDialog {...formHook} />}
      />
      <div className="p-3xl md:p-4xl gap-4xl flex flex-col rounded-xl bg-white">
        <StaffToolbar
          search={hook.search}
          status={hook.status}
          onSearchChange={hook.onSearchChange}
          onStatusChange={hook.onStatusChange}
          setRequest={hook.setRequest}
          isFiltering={hook.isFiltering}
        />
        <List
          staff={hook.staff}
          totalItems={hook.totalItems}
          isLoading={hook.isLoading}
          isFetching={hook.isFetching}
          pagination={hook.pagination}
          setPagination={hook.setPagination}
          openEdit={formHook.openEdit}
        />
      </div>
    </div>
  );
};
