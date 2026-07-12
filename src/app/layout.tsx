import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { ClientOnly } from "@/shared/components/client-only";
import { CustomToaster } from "@/shared/components/custom-toaster";
import { QueryProvider } from "@/shared/providers";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coffee Shop",
  description: "Coffee Shop — Admin, Customer, POS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <QueryProvider>
          <ClientOnly>
            <NuqsAdapter>{children}</NuqsAdapter>
            <CustomToaster />
          </ClientOnly>
        </QueryProvider>
      </body>
    </html>
  );
}
