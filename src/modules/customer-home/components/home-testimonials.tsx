"use client";

import { Star1 } from "iconsax-reactjs";

import { Card, CardContent, Typography } from "@/shared/components";
import { useSmaller } from "@/shared/hooks";

import type { HomeTestimonial } from "../constants";

import { HomeSectionHeader } from "./home-section-header";

type HomeTestimonialsProps = {
  items: HomeTestimonial[];
};

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Star1
        key={i}
        size={16}
        variant={i < rating ? "Bold" : "Linear"}
        className={i < rating ? "text-amber-500" : "text-zinc-300"}
      />
    ))}
  </div>
);

export const HomeTestimonials = ({ items }: HomeTestimonialsProps) => {
  const isMobile = useSmaller("md");

  if (items.length === 0) return null;

  return (
    <section className="space-y-4" aria-label="Customer testimonials">
      <HomeSectionHeader title="Our happy customers" />
      <div
        className={
          isMobile
            ? "flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            : "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        }
      >
        {items.map((item) => (
          <Card
            key={item.id}
            className={`bg-brand-primary-subtle h-full ${isMobile ? "w-[280px] shrink-0 snap-start" : ""}`}
          >
            <CardContent className="flex flex-col gap-3 p-4 md:p-6">
              <StarRating rating={item.rating} />
              <Typography variant="body-sm" color="secondary" className="line-clamp-4">
                &ldquo;{item.text}&rdquo;
              </Typography>
              <Typography variant="body-sm" weight="semibold">
                {item.name}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
