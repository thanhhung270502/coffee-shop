"use client";

import Link from "next/link";

import { Separator, Typography } from "@/shared/components";
import { useQueryShopSettings } from "@/shared/queries";

import { FOOTER_COLUMNS, FOOTER_SOCIAL_LINKS } from "../constants";

import { CustomerFooterNewsletter } from "./customer-footer-newsletter";

const SocialIcon = ({ icon }: { icon: (typeof FOOTER_SOCIAL_LINKS)[number]["icon"] }) => {
  const paths: Record<(typeof FOOTER_SOCIAL_LINKS)[number]["icon"], string> = {
    facebook:
      "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
    instagram:
      "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2z",
    youtube: "M22 8l-6 4 6 4V8zM2 6h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z",
    linkedin:
      "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-12h4v2M2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={20}
      height={20}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[icon]} />
    </svg>
  );
};

export function CustomerFooter() {
  const { data } = useQueryShopSettings();
  const settings = data?.settings;

  return (
    <footer className="bg-brand-primary-subtle mt-auto border-t border-zinc-200">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 text-center">
          <Typography variant="heading-md" weight="semibold">
            {settings?.shopName ?? "Coffee Shop"}
          </Typography>
          {settings?.address ? (
            <Typography variant="body-sm" color="secondary" className="mt-1">
              {settings.address}
            </Typography>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="space-y-3">
              <Typography variant="heading-sm" weight="semibold">
                {column.title}
              </Typography>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>
                      <Typography variant="body-sm" color="secondary" className="hover:text-primary">
                        {link.label}
                      </Typography>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <CustomerFooterNewsletter />

          <div className="flex items-center gap-4">
            {FOOTER_SOCIAL_LINKS.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                className="text-zinc-600 transition-colors hover:text-zinc-900"
                aria-label={social.label}
              >
                <SocialIcon icon={social.icon} />
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-zinc-200 pt-6 md:flex-row md:items-center md:justify-between">
          <Typography variant="body-xs" color="secondary">
            &copy; {new Date().getFullYear()} {settings?.shopName ?? "Coffee Shop"}. All rights
            reserved.
          </Typography>
          {settings?.phone ? (
            <Typography variant="body-xs" color="secondary">
              Phone: {settings.phone}
            </Typography>
          ) : null}
          {settings?.openTime && settings?.closeTime ? (
            <Typography variant="body-xs" color="secondary">
              Open: {settings.openTime} - {settings.closeTime}
            </Typography>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
