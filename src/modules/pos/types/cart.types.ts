export type POSCartItem = {
  id: string;
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  toppingIds: string[];
  toppingNames: string[];
  sugar: string;
  ice: string;
  note: string;
  unitPrice: number;
  quantity: number;
};
