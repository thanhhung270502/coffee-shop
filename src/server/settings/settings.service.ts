import type { ShopSettingsObject } from "@common/models/settings";

import type { ShopSettings } from "@/generated/prisma";

import { findOrCreateSettings, updateSettings } from "./settings.repository";
import type { UpdateSettingsInput } from "./settings.schema";

function toSettingsObject(settings: ShopSettings): ShopSettingsObject {
  return {
    id: settings.id,
    shopName: settings.shopName,
    address: settings.address,
    phone: settings.phone,
    openTime: settings.openTime,
    closeTime: settings.closeTime,
    baseShipping: settings.baseShipping,
  };
}

export async function getSettingsService(): Promise<ShopSettingsObject> {
  const settings = await findOrCreateSettings();
  return toSettingsObject(settings);
}

export async function updateSettingsService(
  input: UpdateSettingsInput,
): Promise<ShopSettingsObject> {
  const settings = await updateSettings(input);
  return toSettingsObject(settings);
}
