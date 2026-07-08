import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function zodErrorResponse(error: ZodError) {
  const message = error.issues[0]?.message ?? "Invalid request";
  return jsonError(message, 400);
}
