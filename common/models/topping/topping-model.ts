export type ToppingObject = {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
};

export type ListToppingsResponse = {
  toppings: ToppingObject[];
};

export type CreateToppingRequest = {
  name: string;
  price: number;
  isActive?: boolean;
};

export type CreateToppingResponse = {
  topping: ToppingObject;
};

export type UpdateToppingRequest = {
  name?: string;
  price?: number;
  isActive?: boolean;
};

export type UpdateToppingResponse = {
  topping: ToppingObject;
};

export type DeleteToppingResponse = {
  ok: boolean;
};
