import type { StaffObject } from "@common/models/staff";

import { hashPassword } from "@/libs/auth/password";
import { AppError } from "@/libs/errors";

import {
  createStaff,
  findAllStaff,
  findStaffById,
  findUserByEmail,
  updateStaff,
  updateStaffPassword,
} from "./staff.repository";
import type {
  CreateStaffInput,
  ResetStaffPasswordInput,
  UpdateStaffInput,
} from "./staff.schema";

type StaffRow = Awaited<ReturnType<typeof findAllStaff>>[number];

function toStaffObject(staff: StaffRow): StaffObject {
  return {
    id: staff.id,
    email: staff.email,
    name: staff.name,
    phone: staff.phone,
    isActive: staff.isActive,
    createdAt: staff.createdAt.toISOString(),
  };
}

export async function listStaff(): Promise<StaffObject[]> {
  const staff = await findAllStaff();
  return staff.map(toStaffObject);
}

export async function createStaffService(input: CreateStaffInput): Promise<StaffObject> {
  const email = input.email.toLowerCase();
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new AppError("Email is already in use", 409);
  }

  const passwordHash = await hashPassword(input.password);
  const staff = await createStaff({
    email,
    passwordHash,
    name: input.name,
    phone: input.phone,
  });
  return toStaffObject(staff);
}

export async function updateStaffService(
  id: string,
  input: UpdateStaffInput,
): Promise<StaffObject> {
  const existing = await findStaffById(id);
  if (!existing) {
    throw new AppError("Staff member not found", 404);
  }
  const staff = await updateStaff(id, input);
  return toStaffObject(staff);
}

export async function resetStaffPasswordService(
  id: string,
  input: ResetStaffPasswordInput,
): Promise<{ ok: boolean }> {
  const existing = await findStaffById(id);
  if (!existing) {
    throw new AppError("Staff member not found", 404);
  }
  const passwordHash = await hashPassword(input.password);
  await updateStaffPassword(id, passwordHash);
  return { ok: true };
}
