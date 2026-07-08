import type { PublicUser } from "@/libs/auth";

export type { PublicUser };

export type AuthUserResponse = {
  user: PublicUser;
};

export type LogoutResponse = {
  ok: true;
};
