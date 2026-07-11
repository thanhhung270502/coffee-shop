import { Suspense } from "react";

import { CustomerOrderTrackingPage } from "@/modules/customer/pages";
import { Skeleton } from "@/shared/components";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<Skeleton className="h-64 w-full rounded-lg" />}>
      <CustomerOrderTrackingPage orderId={id} />
    </Suspense>
  );
}
