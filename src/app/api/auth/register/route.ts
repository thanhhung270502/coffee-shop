import { ZodError } from "zod";

import {
  createSession,
  hashPassword,
  registerSchema,
  toPublicUser,
} from "@/libs/auth";
import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { prisma } from "@/libs/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = registerSchema.parse(body);

    const existing = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (existing) {
      return jsonError("Email is already registered", 409);
    }

    const passwordHash = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        passwordHash,
        name: input.name,
      },
    });

    await createSession(user.id);

    return jsonOk({ user: toPublicUser(user) }, 201);
  } catch (error) {
    if (error instanceof ZodError) {
      return zodErrorResponse(error);
    }

    console.error("POST /api/auth/register failed", error);
    return jsonError("Internal server error", 500);
  }
}
