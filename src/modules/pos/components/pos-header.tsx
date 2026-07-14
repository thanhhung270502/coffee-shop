"use client";

import { PosHeaderToolbar } from "./pos-header-toolbar";
import { PosHeaderTopBar } from "./pos-header-top-bar";

export function PosHeader() {
  return (
    <header className="shrink-0 bg-white">
      <PosHeaderTopBar />
      <PosHeaderToolbar />
    </header>
  );
}
