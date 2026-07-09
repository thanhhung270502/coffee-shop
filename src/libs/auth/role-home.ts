import type { Role } from "@/generated/prisma";

export function getRoleHomePath(role: Role): string {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "STAFF":
      return "/pos";
    case "CUSTOMER":
      return "/";
    default: {
      const _exhaustive: never = role;
      return _exhaustive;
    }
  }
}
