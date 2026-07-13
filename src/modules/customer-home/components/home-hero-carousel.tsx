"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft2, ArrowRight2 } from "iconsax-reactjs";
import Link from "next/link";

import { Button, Typography } from "@/shared/components";

import type { HomeHeroSlide } from "../constants";

type HomeHeroCarouselProps = {
  slides: HomeHeroSlide[];
};

const AUTO_ADVANCE_MS = 6000;

export const HomeHeroCarousel = ({ slides }: HomeHeroCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const goToSlide = useCallback(
    (index: number) => {
      const nextIndex = (index + slides.length) % slides.length;
      setActiveIndex(nextIndex);
      scrollRef.current?.children[nextIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    },
    [slides.length]
  );

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    const timer = setInterval(() => {
      goToSlide(activeIndex + 1);
    }, AUTO_ADVANCE_MS);

    return () => clearInterval(timer);
  }, [activeIndex, goToSlide, isPaused, slides.length]);

  if (slides.length === 0) return null;

  return (
    <section
      className="relative w-full"
      aria-roledescription="carousel"
      aria-label="Featured promotions"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="relative min-w-full snap-start"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}: ${slide.title}`}
            aria-hidden={index !== activeIndex}
          >
            <div className="relative flex min-h-[280px] items-center md:min-h-[420px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-transparent" />
              <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-12 md:px-8 md:py-16">
                <Typography variant="heading-xl" className="max-w-xl text-white">
                  {slide.title}
                </Typography>
                <Typography variant="body-lg" className="max-w-lg text-white/90">
                  {slide.subtitle}
                </Typography>
                <div>
                  <Link href={slide.ctaHref}>
                    <Button variant="primary" size="lg">
                      {slide.ctaLabel}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {slides.length > 1 ? (
        <>
          <Button
            type="button"
            variant="secondary-gray"
            size="sm"
            className="absolute top-1/2 left-4 z-10 hidden -translate-y-1/2 rounded-full md:inline-flex"
            onClick={() => goToSlide(activeIndex - 1)}
            aria-label="Previous slide"
            startIcon={ArrowLeft2}
          />
          <Button
            type="button"
            variant="secondary-gray"
            size="sm"
            className="absolute top-1/2 right-4 z-10 hidden -translate-y-1/2 rounded-full md:inline-flex"
            onClick={() => goToSlide(activeIndex + 1)}
            aria-label="Next slide"
            startIcon={ArrowRight2}
          />
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((slide, index) => (
              <Button
                key={slide.id}
                type="button"
                variant="tertiary-gray"
                size="xs"
                className={`!min-h-0 !rounded-full !p-0 ${
                  index === activeIndex ? "h-2 w-6 bg-white" : "size-2 bg-white/50"
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
};
