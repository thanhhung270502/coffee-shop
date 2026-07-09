import { createSession, deleteSession, getSessionUser, toPublicUser, verifyPassword } from "@/libs/auth";
import { hashPassword } from "@/libs/auth/password";
import { AppError } from "@/libs/errors";

import { createUser, findUserByEmail } from "./auth.repository";
import type { LoginInput, RegisterInput } from "./auth.schema";
import type { AuthUserResponse, LogoutResponse } from "./auth.types";

export async function loginUser(input: LoginInput): Promise<AuthUserResponse> {
  const email = input.email.toLowerCase();
  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isValid = await verifyPassword(input.password, user.passwordHash);

  if (!isValid) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.isActive) {
    throw new AppError("Account is disabled", 403);
  }

  await createSession(user.id);

  return { user: toPublicUser(user) };
}

export async function registerUser(input: RegisterInput): Promise<AuthUserResponse> {
  const email = input.email.toLowerCase();
  const existing = await findUserByEmail(email);

  if (existing) {
    throw new AppError("Email is already registered", 409);
  }

  const passwordHash = await hashPassword(input.password);
  const user = await createUser({
    email,
    passwordHash,
    name: input.name,
    role: "CUSTOMER",
  });

  await createSession(user.id);

  return { user: toPublicUser(user) };
}

export async function getCurrentUser(): Promise<AuthUserResponse> {
  const user = await getSessionUser();

  if (!user) {
    throw new AppError("Unauthorized", 401);
  }

  return { user };
}

export async function logoutUser(): Promise<LogoutResponse> {
  await deleteSession();
  return { ok: true };
}
