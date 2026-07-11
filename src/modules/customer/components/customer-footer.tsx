"use client";

import { Typography } from "@/shared/components";
import { useQueryShopSettings } from "@/shared/queries";

export function CustomerFooter() {
  const { data } = useQueryShopSettings();
  const settings = data?.settings;

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8">
        <Typography variant="heading-sm">{settings?.shopName ?? "Coffee Shop"}</Typography>
        {settings?.address ? (
          <Typography variant="body-sm" color="secondary">
            {settings.address}
          </Typography>
        ) : null}
        {settings?.phone ? (
          <Typography variant="body-sm" color="secondary">
            Phone: {settings.phone}
          </Typography>
        ) : null}
        {settings?.openTime && settings?.closeTime ? (
          <Typography variant="body-sm" color="secondary">
            Open: {settings.openTime} - {settings.closeTime}
          </Typography>
        ) : null}
      </div>
    </footer>
  );
}
