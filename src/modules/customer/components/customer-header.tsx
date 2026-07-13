"use client";

import { CustomerHeaderNavBar } from "./customer-header-nav-bar";
import { CustomerHeaderTopBar } from "./customer-header-top-bar";

export function CustomerHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur">
      <CustomerHeaderTopBar />
      <CustomerHeaderNavBar />
    </header>
  );
}
