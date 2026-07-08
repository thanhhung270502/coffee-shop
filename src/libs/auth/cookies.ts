export const SESSION_COOKIE_NAME = "session_token";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export function getSessionCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires: expiresAt,
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

export function getClearedSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  };
}

export { SESSION_MAX_AGE_SECONDS };
