import { requireRoleOrRedirect } from "@/libs/auth/guards";

export default async function PosLayout({ children }: { children: React.ReactNode }) {
  await requireRoleOrRedirect(["ADMIN", "STAFF"]);

  return <div className="flex min-h-full flex-1 flex-col">{children}</div>;
}
