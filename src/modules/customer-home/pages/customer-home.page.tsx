"use client";

import {
  HomeCategoryBanners,
  HomeCategoryExplorer,
  HomeDrinksRow,
  HomeHeroCarousel,
  HomeProductsRow,
  HomePromoGrid,
  HomePromoMosaic,
  HomeTestimonials,
} from "../components";
import {
  HOME_HERO_SLIDES,
  HOME_MOSAIC_TILES,
  HOME_PROMO_CARDS,
  HOME_TESTIMONIALS,
} from "../constants";
import { useCustomerHome } from "../hooks";

export const CustomerHomePage = () => {
  const data = useCustomerHome();

  return (
    <div className="gap-5xl flex flex-col">
      <HomeHeroCarousel slides={HOME_HERO_SLIDES} />
      <div className="gap-5xl mx-auto flex w-full max-w-7xl flex-col px-4 pb-8">
        <HomePromoGrid cards={HOME_PROMO_CARDS} />
        <HomeCategoryBanners
          categories={data.drinkCategories}
          isLoading={data.drinkCategoriesLoading}
        />
        <HomeDrinksRow
          title="Popular Drinks"
          href="/order"
          drinks={data.popularDrinks}
          isLoading={data.drinksLoading}
        />
        <HomeProductsRow
          title="Featured Products"
          href="/shop"
          products={data.featuredProducts}
          isLoading={data.productsLoading}
        />
        <HomeCategoryExplorer categories={data.allCategories} isLoading={data.categoriesLoading} />
        <HomePromoMosaic tiles={HOME_MOSAIC_TILES} />
        <HomeTestimonials items={HOME_TESTIMONIALS} />
      </div>
    </div>
  );
};
