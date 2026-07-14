export const POS_TABS = [
  { id: "sell", label: "Sell" },
  { id: "queue", label: "Kitchen Queue" },
  { id: "online", label: "Online Orders" },
] as const;

export type PosTab = (typeof POS_TABS)[number]["id"];

export const POS_TAX_PRESETS = [
  { value: "0", label: "No tax (0%)" },
  { value: "5", label: "5%" },
  { value: "8", label: "8%" },
  { value: "10", label: "10%" },
] as const;

export type PosPaymentUiOption = "CASH" | "CARD" | "SCAN";

export const POS_PAYMENT_OPTIONS: {
  id: PosPaymentUiOption;
  label: string;
  description: string;
}[] = [
  { id: "CASH", label: "Cash", description: "Pay with cash" },
  { id: "CARD", label: "Debit Card", description: "Card or bank transfer" },
  { id: "SCAN", label: "Scan", description: "QR code payment" },
];
