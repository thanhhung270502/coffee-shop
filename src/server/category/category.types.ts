import type { Category } from "@/generated/prisma";

export type CategoryWithCount = Category & {
  _count: { products: number };
};
