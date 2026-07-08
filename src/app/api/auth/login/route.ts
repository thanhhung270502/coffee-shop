import { ZodError } from "zod";

import {
  createSession,
  loginSchema,
  toPublicUser,
  verifyPassword,
} from "@/libs/auth";
import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { prisma } from "@/libs/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (!user) {
      return jsonError("Invalid email or password", 401);
    }

    const isValid = await verifyPassword(input.password, user.passwordHash);

    if (!isValid) {
      return jsonError("Invalid email or password", 401);
    }

    await createSession(user.id);

    return jsonOk({ user: toPublicUser(user) });
  } catch (error) {
    if (error instanceof ZodError) {
      return zodErrorResponse(error);
    }

    console.error("POST /api/auth/login failed", error);
    return jsonError("Internal server error", 500);
  }
}
