-- CreateTable
CREATE TABLE "ShopSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "shopName" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "openTime" TEXT,
    "closeTime" TEXT,
    "baseShipping" INTEGER NOT NULL DEFAULT 15000,

    CONSTRAINT "ShopSettings_pkey" PRIMARY KEY ("id")
);
