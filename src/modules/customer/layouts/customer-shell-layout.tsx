"use client";

import { Provider } from "jotai";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";

import { CustomerFooter } from "../components/customer-footer";
import { CustomerHeader } from "../components/customer-header";
import { MobileNav } from "../components/mobile-nav";

type CustomerShellLayoutProps = {
  children: React.ReactNode;
};

export function CustomerShellLayout({ children }: CustomerShellLayoutProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <Provider>
      <div className="flex min-h-screen flex-col bg-white">
        <CustomerHeader />
        <main className="mx-auto w-full flex-1 pb-24 md:pb-6">
          {isHome ? (
            children
          ) : (
            <div className="mx-auto w-full max-w-6xl px-4 py-6">{children}</div>
          )}
        </main>
        <CustomerFooter />
        <MobileNav />
      </div>
      <Toaster position="top-center" richColors closeButton />
    </Provider>
  );
}
