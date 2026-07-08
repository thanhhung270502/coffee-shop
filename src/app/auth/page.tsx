import type { Metadata } from "next";

import { AuthPlayground } from "./auth-playground";

export const metadata: Metadata = {
  title: "Auth API playground",
  description: "Test register, login, logout, and session me endpoints",
};

export default function AuthPage() {
  return <AuthPlayground />;
}
