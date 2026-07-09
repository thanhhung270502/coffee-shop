import { randomBytes } from "crypto";
import { cookies } from "next/headers";

import type { User } from "@/generated/prisma";
import { prisma } from "@/libs/prisma";

import {
  getClearedSessionCookieOptions,
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "./cookies";

export type PublicUser = Pick<
  User,
  "id" | "email" | "name" | "phone" | "role" | "isActive" | "createdAt" | "updatedAt"
>;

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function createSessionToken() {
  return randomBytes(32).toString("hex");
}

function getSessionExpiryDate() {
  return new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);
}

export async function createSession(userId: string) {
  const token = createSessionToken();
  const expiresAt = getSessionExpiryDate();

  await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions(expiresAt));

  return { token, expiresAt };
}

export async function getSessionUser(): Promise<PublicUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => undefined);
    cookieStore.set(SESSION_COOKIE_NAME, "", getClearedSessionCookieOptions());
    return null;
  }

  if (!session.user.isActive) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => undefined);
    cookieStore.set(SESSION_COOKIE_NAME, "", getClearedSessionCookieOptions());
    return null;
  }

  return toPublicUser(session.user);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }

  cookieStore.set(SESSION_COOKIE_NAME, "", getClearedSessionCookieOptions());
}

export async function deleteExpiredSessions() {
  await prisma.session.deleteMany({
    where: {
      expiresAt: {
        lte: new Date(),
      },
    },
  });
}
