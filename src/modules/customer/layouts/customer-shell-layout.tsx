"use client";

import { Provider } from "jotai";

import { CustomerFooter } from "../components/customer-footer";
import { CustomerHeader } from "../components/customer-header";

type CustomerShellLayoutProps = {
  children: React.ReactNode;
};

export function CustomerShellLayout({ children }: CustomerShellLayoutProps) {
  return (
    <Provider>
      <div className="flex min-h-screen flex-col bg-white">
        <CustomerHeader />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
        <CustomerFooter />
      </div>
    </Provider>
  );
}
