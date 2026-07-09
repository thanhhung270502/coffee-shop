import type { Role } from "@/generated/prisma";
import { redirect } from "next/navigation";

import { AppError } from "@/libs/errors";

import { getSessionUser } from "./session";
import type { PublicUser } from "./session";

export async function requireAuth(): Promise<PublicUser> {
  const user = await getSessionUser();

  if (!user) {
    throw new AppError("Unauthorized", 401);
  }

  return user;
}

export async function requireRole(allowed: Role[]): Promise<PublicUser> {
  const user = await requireAuth();

  if (!allowed.includes(user.role)) {
    throw new AppError("Forbidden", 403);
  }

  return user;
}

export async function requireAuthOrRedirect(loginPath = "/auth"): Promise<PublicUser> {
  const user = await getSessionUser();

  if (!user) {
    redirect(loginPath);
  }

  return user;
}

export async function requireRoleOrRedirect(
  allowed: Role[],
  options: { loginPath?: string; forbiddenPath?: string } = {},
): Promise<PublicUser> {
  const { loginPath = "/auth", forbiddenPath = "/" } = options;
  const user = await getSessionUser();

  if (!user) {
    redirect(loginPath);
  }

  if (!allowed.includes(user.role)) {
    redirect(forbiddenPath);
  }

  return user;
}
