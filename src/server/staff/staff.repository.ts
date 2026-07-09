import { prisma } from "@/libs/prisma";

export async function findAllStaff() {
  return prisma.user.findMany({
    where: { role: "STAFF" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      isActive: true,
      createdAt: true,
    },
  });
}

export async function findStaffById(id: string) {
  return prisma.user.findFirst({
    where: { id, role: "STAFF" },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      isActive: true,
      createdAt: true,
    },
  });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createStaff(data: {
  email: string;
  passwordHash: string;
  name?: string;
  phone?: string;
}) {
  return prisma.user.create({
    data: {
      email: data.email,
      passwordHash: data.passwordHash,
      name: data.name,
      phone: data.phone,
      role: "STAFF",
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      isActive: true,
      createdAt: true,
    },
  });
}

export async function updateStaff(
  id: string,
  data: { name?: string; phone?: string | null; isActive?: boolean },
) {
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      isActive: true,
      createdAt: true,
    },
  });
}

export async function updateStaffPassword(id: string, passwordHash: string) {
  return prisma.user.update({
    where: { id },
    data: { passwordHash },
  });
}
