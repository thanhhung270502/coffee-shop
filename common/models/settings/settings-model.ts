export type ShopSettingsObject = {
  id: string;
  shopName: string;
  address: string | null;
  phone: string | null;
  openTime: string | null;
  closeTime: string | null;
  baseShipping: number;
};

export type GetShopSettingsResponse = {
  settings: ShopSettingsObject;
};

export type UpdateShopSettingsRequest = {
  shopName?: string;
  address?: string | null;
  phone?: string | null;
  openTime?: string | null;
  closeTime?: string | null;
  baseShipping?: number;
};

export type UpdateShopSettingsResponse = {
  settings: ShopSettingsObject;
};
