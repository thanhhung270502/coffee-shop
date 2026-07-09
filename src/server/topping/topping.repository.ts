import { prisma } from "@/libs/prisma";

export async function findAllToppings() {
  return prisma.topping.findMany({ orderBy: { name: "asc" } });
}

export async function findToppingById(id: string) {
  return prisma.topping.findUnique({ where: { id } });
}

export async function createTopping(data: { name: string; price: number; isActive: boolean }) {
  return prisma.topping.create({ data });
}

export async function updateTopping(
  id: string,
  data: { name?: string; price?: number; isActive?: boolean },
) {
  return prisma.topping.update({ where: { id }, data });
}

export async function deleteTopping(id: string) {
  return prisma.topping.delete({ where: { id } });
}
