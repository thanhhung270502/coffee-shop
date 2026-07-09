/** User role */

export enum EUserRole {
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  CUSTOMER = "CUSTOMER",
}

/** Public user */

export type PublicUserObject = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: EUserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

/** Register */

export type RegisterRequest = {
  email: string;
  password: string;
  name?: string;
};

export type RegisterResponse = {
  user: PublicUserObject;
};

/** Login */

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: PublicUserObject;
};

/** Me */

export type MeResponse = {
  user: PublicUserObject;
};

/** Logout */

export type LogoutResponse = {
  ok: true;
};
