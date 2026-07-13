import Link from "next/link";

import { Typography } from "@/shared/components";

type HomeSectionHeaderProps = {
  title: string;
  href?: string;
  viewAllLabel?: string;
};

export const HomeSectionHeader = ({
  title,
  href,
  viewAllLabel = "View all",
}: HomeSectionHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <Typography variant="heading-md">{title}</Typography>
      {href ? (
        <Link href={href} className="text-brand-main shrink-0 text-sm font-medium hover:underline">
          {viewAllLabel}
        </Link>
      ) : null}
    </div>
  );
};
