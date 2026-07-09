import { prisma } from "@/libs/prisma";

const DEFAULT_SETTINGS = {
  id: "default",
  shopName: "Coffee Shop",
  address: null,
  phone: null,
  openTime: "07:00",
  closeTime: "22:00",
  baseShipping: 15000,
} as const;

export async function findOrCreateSettings() {
  const existing = await prisma.shopSettings.findUnique({ where: { id: "default" } });
  if (existing) return existing;
  return prisma.shopSettings.create({ data: DEFAULT_SETTINGS });
}

export async function updateSettings(data: {
  shopName?: string;
  address?: string | null;
  phone?: string | null;
  openTime?: string | null;
  closeTime?: string | null;
  baseShipping?: number;
}) {
  return prisma.shopSettings.upsert({
    where: { id: "default" },
    create: { ...DEFAULT_SETTINGS, ...data },
    update: data,
  });
}
