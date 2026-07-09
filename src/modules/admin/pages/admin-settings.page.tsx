"use client";

import { useEffect, useState } from "react";

import { AdminPageHeader } from "@/modules/admin/components/admin-page-header";
import { Button } from "@/shared/components/button";
import { Input } from "@/shared/components/input";
import { Typography } from "@/shared/components/typography";
import { useUpdateSettingsMutation } from "@/shared/mutations/use-admin-settings-mutation";
import { useQueryAdminSettings } from "@/shared/queries/use-query-admin-settings";

type SettingsFormState = {
  shopName: string;
  address: string;
  phone: string;
  openTime: string;
  closeTime: string;
  baseShipping: string;
};

export function AdminSettingsPage() {
  const { data, isLoading } = useQueryAdminSettings();
  const updateMutation = useUpdateSettingsMutation();
  const [form, setForm] = useState<SettingsFormState>({
    shopName: "",
    address: "",
    phone: "",
    openTime: "",
    closeTime: "",
    baseShipping: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data?.settings) {
      const s = data.settings;
      setForm({
        shopName: s.shopName,
        address: s.address ?? "",
        phone: s.phone ?? "",
        openTime: s.openTime ?? "",
        closeTime: s.closeTime ?? "",
        baseShipping: String(s.baseShipping),
      });
    }
  }, [data]);

  const handleSubmit = async () => {
    await updateMutation.mutateAsync({
      shopName: form.shopName,
      address: form.address || null,
      phone: form.phone || null,
      openTime: form.openTime || null,
      closeTime: form.closeTime || null,
      baseShipping: Number(form.baseShipping) || 0,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (isLoading) {
    return <Typography variant="body-md">Loading...</Typography>;
  }

  return (
    <div>
      <AdminPageHeader title="Settings" description="Shop information and basic configuration" />

      <div className="max-w-lg rounded-xl border border-primary bg-white p-6">
        <div className="flex flex-col gap-4">
          <Input label="Shop Name" value={form.shopName} onChange={(e) => setForm((p) => ({ ...p, shopName: e.target.value }))} />
          <Input label="Address" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Open Time" value={form.openTime} onChange={(e) => setForm((p) => ({ ...p, openTime: e.target.value }))} placeholder="07:00" />
            <Input label="Close Time" value={form.closeTime} onChange={(e) => setForm((p) => ({ ...p, closeTime: e.target.value }))} placeholder="22:00" />
          </div>
          <Input
            label="Base Shipping Fee (VND)"
            type="number"
            value={form.baseShipping}
            onChange={(e) => setForm((p) => ({ ...p, baseShipping: e.target.value }))}
          />
          <div className="flex items-center gap-3">
            <Button variant="primary" size="sm" onClick={handleSubmit} disabled={updateMutation.isPending}>
              Save Settings
            </Button>
            {saved && (
              <Typography variant="body-sm" color="success-primary">
                Saved!
              </Typography>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
