"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const banners = [
  {
    src: "/banner1.png",
    alt: "Maghora Premium Makhana — Campaign Banner 1",
  },
  {
    src: "/banner2.png",
    alt: "Maghora Premium Makhana — Campaign Banner 2",
  },
  {
    src: "/banner3.png",
    alt: "Maghora Premium Makhana — Campaign Banner 3",
  },
];

export function HeroBanners() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % banners.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  }, []);

  // Autoplay with pause on hover
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, isPaused]);

  // Touch / swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  return (
    <section
      className="bg-[#F7F0E3] pt-3 sm:pt-5 lg:pt-7 pb-2 select-none"
      aria-label="Campaign Hero Banners"
    >
      <div className="mx-auto max-w-5xl px-3 sm:px-6">
        {/* Banner Card Frame — exact 2:1 aspect ratio, constrained max-width so it never feels oversized */}
        <div
          className="relative w-full aspect-[2/1] rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-sm border border-[#E2D7C3]/80 bg-[#ECE3D0] group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <Link href="/products" className="block relative w-full h-full cursor-pointer">
                <Image
                  src={banners[current].src}
                  alt={banners[current].alt}
                  fill
                  priority={current === 0}
                  quality={90}
                  className="object-cover object-center w-full h-full"
                  sizes="(min-width: 1280px) 1024px, (min-width: 768px) 90vw, 100vw"
                />
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              prev();
            }}
            className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-black/25 hover:bg-black/45 text-white backdrop-blur-md flex items-center justify-center transition-all duration-300 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer shadow-md z-10"
            aria-label="Previous banner"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              next();
            }}
            className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-black/25 hover:bg-black/45 text-white backdrop-blur-md flex items-center justify-center transition-all duration-300 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer shadow-md z-10"
            aria-label="Next banner"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* Carousel indicators with pill backdrop */}
          <div className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-black/25 backdrop-blur-md z-10">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goTo(i);
                }}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  i === current
                    ? "w-5 sm:w-6 h-1.5 sm:h-2 bg-[#C49A50]"
                    : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/60 hover:bg-white"
                }`}
                aria-label={`Go to banner slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
