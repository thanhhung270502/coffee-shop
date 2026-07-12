"use client";

import { useEffect } from "react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function PosError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("POS error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-950 p-6 text-center text-white">
      <p className="text-5xl font-bold text-gray-700">Error</p>
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="max-w-sm text-sm text-gray-400">
        {error.message || "An unexpected error occurred in the POS system."}
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
      >
        Try Again
      </button>
    </div>
  );
}
