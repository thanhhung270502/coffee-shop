"use client";

import { useMemo } from "react";
import { EProductType } from "@common/models/category";

import {
  useQueryCatalogCategories,
  useQueryCatalogDrinks,
  useQueryCatalogProducts,
} from "@/shared/queries";

export const useCustomerHome = () => {
  const { data: drinksData, isLoading: drinksLoading } = useQueryCatalogDrinks();
  const { data: productsData, isLoading: productsLoading } = useQueryCatalogProducts();
  const { data: drinkCategoriesData, isLoading: drinkCategoriesLoading } =
    useQueryCatalogCategories(EProductType.DRINK);
  const { data: productCategoriesData, isLoading: productCategoriesLoading } =
    useQueryCatalogCategories(EProductType.PACKAGED);

  const popularDrinks = useMemo(
    () => drinksData?.drinks.slice(0, 6) ?? [],
    [drinksData?.drinks]
  );
  const featuredProducts = useMemo(
    () => productsData?.products.slice(0, 4) ?? [],
    [productsData?.products]
  );
  const drinkCategories = useMemo(
    () => drinkCategoriesData?.categories ?? [],
    [drinkCategoriesData?.categories]
  );
  const productCategories = useMemo(
    () => productCategoriesData?.categories ?? [],
    [productCategoriesData?.categories]
  );
  const allCategories = useMemo(
    () => [...drinkCategories, ...productCategories],
    [drinkCategories, productCategories]
  );

  return {
    popularDrinks,
    featuredProducts,
    drinkCategories,
    productCategories,
    allCategories,
    drinksLoading,
    productsLoading,
    drinkCategoriesLoading,
    productCategoriesLoading,
    categoriesLoading: drinkCategoriesLoading || productCategoriesLoading,
  };
};

export type UseCustomerHomeReturn = ReturnType<typeof useCustomerHome>;
