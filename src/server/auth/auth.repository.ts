import type { Role } from "@/generated/prisma";
import { prisma } from "@/libs/prisma";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function createUser(data: {
  email: string;
  passwordHash: string;
  name?: string;
  role?: Role;
}) {
  return prisma.user.create({
    data: {
      email: data.email,
      passwordHash: data.passwordHash,
      name: data.name,
      role: data.role ?? "CUSTOMER",
    },
  });
}
