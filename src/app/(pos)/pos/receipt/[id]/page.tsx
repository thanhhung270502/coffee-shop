import { PosReceiptPage } from "@/modules/pos/pages/pos-receipt.page";

type ReceiptPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReceiptPage({ params }: ReceiptPageProps) {
  const { id } = await params;
  return <PosReceiptPage orderId={id} />;
}
