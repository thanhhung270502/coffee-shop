"use client";

import { useState } from "react";
import type { PublicProductObject } from "@common/models/catalog";
import { EProductType } from "@common/models/category";

import { Button, Skeleton, Typography } from "@/shared/components";
import { useQueryCatalogCategories, useQueryCatalogProducts } from "@/shared/queries";

import { ProductCard } from "../components/product-card";
import { ProductDetailSheet } from "../components/product-detail-sheet";

export function CustomerShopPage() {
  const [categorySlug, setCategorySlug] = useState<string | undefined>();
  const [selectedProduct, setSelectedProduct] = useState<PublicProductObject | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const { data: categoriesData } = useQueryCatalogCategories(EProductType.PACKAGED);
  const { data: productsData, isLoading } = useQueryCatalogProducts(categorySlug);

  const handleSelectProduct = (product: PublicProductObject) => {
    setSelectedProduct(product);
    setSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      <Typography variant="heading-md">Shop Products</Typography>

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="lg:w-48">
          <Typography variant="heading-sm" className="mb-3">
            Categories
          </Typography>
          <div className="flex flex-wrap gap-2 lg:flex-col">
            <Button
              type="button"
              variant={!categorySlug ? "primary" : "secondary-gray"}
              size="sm"
              onClick={() => setCategorySlug(undefined)}
            >
              All
            </Button>
            {categoriesData?.categories.map((category) => (
              <Button
                key={category.id}
                type="button"
                variant={categorySlug === category.slug ? "primary" : "secondary-gray"}
                size="sm"
                onClick={() => setCategorySlug(category.slug)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </aside>

        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-lg" />
              ))}
            </div>
          ) : productsData?.products.length === 0 ? (
            <Typography variant="body-md" color="secondary">
              No products available.
            </Typography>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {productsData?.products.map((product) => (
                <ProductCard key={product.id} product={product} onSelect={handleSelectProduct} />
              ))}
            </div>
          )}
        </div>
      </div>

      <ProductDetailSheet
        product={selectedProduct}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}
