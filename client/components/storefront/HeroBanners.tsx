"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BANNERS = [
  {
    src: "/banner1.png",
    alt: "Maghora Premium Makhana — Campaign Showcase 1",
  },
  {
    src: "/banner2.png",
    alt: "Maghora Premium Makhana — Campaign Showcase 2",
  },
  {
    src: "/banner3.png",
    alt: "Maghora Premium Makhana — Campaign Showcase 3",
  },
];

export function HeroBanners() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const handleBannerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === "/") {
      const el = document.getElementById("products");
      if (el) {
        const headerOffset = 80;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        window.history.pushState(null, "", "#products");
      }
    } else {
      router.push("/#products");
    }
  };

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % BANNERS.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  }, []);

  // Autoplay with pause on hover
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, isPaused]);

  // Touch / swipe support
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
      id="hero-carousel"
      className="bg-[#F7F0E3] pt-3 sm:pt-5 pb-4 select-none"
      aria-label="Maghora Hero Carousel"
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Full available hero width frame with exact 2:1 natural banner aspect ratio */}
        <div
          className="relative w-full aspect-[2/1] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(41,40,32,0.06)] border border-[#E2D7C3]/80 bg-[#ECE3D0] group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full cursor-pointer"
              onClick={handleBannerClick}
            >
              <Image
                src={BANNERS[current].src}
                alt={BANNERS[current].alt}
                fill
                priority={current === 0}
                quality={92}
                className="object-cover object-center w-full h-full"
                sizes="(min-width: 1280px) 1280px, (min-width: 768px) 95vw, 100vw"
              />
            </motion.div>
          </AnimatePresence>

          {/* Previous Slide Control */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              prev();
            }}
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-11 sm:w-11 rounded-full bg-black/35 hover:bg-black/60 text-white backdrop-blur-md flex items-center justify-center transition-all duration-300 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer shadow-md z-10 hover:scale-105 active:scale-95"
            aria-label="Previous campaign banner"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* Next Slide Control */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              next();
            }}
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-11 sm:w-11 rounded-full bg-black/35 hover:bg-black/60 text-white backdrop-blur-md flex items-center justify-center transition-all duration-300 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer shadow-md z-10 hover:scale-105 active:scale-95"
            aria-label="Next campaign banner"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* Subtle Carousel Indicators */}
          <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md z-10">
            {BANNERS.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goTo(i);
                }}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  i === current
                    ? "w-6 sm:w-7 h-1.5 sm:h-2 bg-[#C49A50]"
                    : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/60 hover:bg-white"
                }`}
                aria-label={`Switch to banner ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
