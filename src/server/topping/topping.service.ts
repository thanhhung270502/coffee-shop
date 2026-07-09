import type { ToppingObject } from "@common/models/topping";

import type { Topping } from "@/generated/prisma";
import { AppError } from "@/libs/errors";

import {
  createTopping,
  deleteTopping,
  findAllToppings,
  findToppingById,
  updateTopping,
} from "./topping.repository";
import type { CreateToppingInput, UpdateToppingInput } from "./topping.schema";

function toToppingObject(topping: Topping): ToppingObject {
  return {
    id: topping.id,
    name: topping.name,
    price: topping.price,
    isActive: topping.isActive,
  };
}

export async function listToppings(): Promise<ToppingObject[]> {
  const toppings = await findAllToppings();
  return toppings.map(toToppingObject);
}

export async function createToppingService(input: CreateToppingInput): Promise<ToppingObject> {
  const topping = await createTopping({
    name: input.name,
    price: input.price,
    isActive: input.isActive ?? true,
  });
  return toToppingObject(topping);
}

export async function updateToppingService(
  id: string,
  input: UpdateToppingInput,
): Promise<ToppingObject> {
  const existing = await findToppingById(id);
  if (!existing) {
    throw new AppError("Topping not found", 404);
  }
  const topping = await updateTopping(id, input);
  return toToppingObject(topping);
}

export async function deleteToppingService(id: string): Promise<{ ok: boolean }> {
  const existing = await findToppingById(id);
  if (!existing) {
    throw new AppError("Topping not found", 404);
  }
  await deleteTopping(id);
  return { ok: true };
}
