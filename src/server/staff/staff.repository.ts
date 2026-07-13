import { prisma } from "@/libs/prisma";

type StaffListFilters = {
  limit: number;
  offset: number;
  search?: string;
  isActive?: boolean;
};

function buildStaffListWhere(filters: Omit<StaffListFilters, "limit" | "offset">) {
  const search = filters.search?.trim();

  return {
    role: "STAFF" as const,
    ...(filters.isActive !== undefined ? { isActive: filters.isActive } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { phone: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };
}

export async function findStaff(filters: StaffListFilters) {
  const where = buildStaffListWhere(filters);

  const [total_record, items] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        isActive: true,
        createdAt: true,
      },
      skip: filters.offset,
      take: filters.limit,
    }),
  ]);

  return { total_record, items };
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
