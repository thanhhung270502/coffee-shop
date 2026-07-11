export type DrinkCartItem = {
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

export type ProductCartItem = {
  id: string;
  productId: string;
  productName: string;
  skuId: string;
  skuLabel: string;
  unitPrice: number;
  quantity: number;
};
