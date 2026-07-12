"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

import { PageTitles } from "../constants";
import { useGreater } from "../hooks";
import { getRouteKey } from "../utils/routes.util";
import { Typography } from "../";

export const getPageTitle = (pathname: string): string => {
  const routeKey = getRouteKey(pathname);
  return routeKey ? PageTitles[routeKey] : "Unknown Page";
};

export const PageTitle = () => {
  const pathname = usePathname();
  const isDesktop = useGreater("lg");
  const title = useMemo(() => getPageTitle(pathname), [pathname]);

  return (
    <Typography variant={isDesktop ? "heading-sm" : "body-lg"} className="font-semibold">
      {title}
    </Typography>
  );
};
