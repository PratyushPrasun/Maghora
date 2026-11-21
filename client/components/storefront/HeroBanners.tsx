"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BannerItem {
  id: string;
  src: string;
  alt: string;
  objectPositionDesktop: string;
  objectPositionMobile: string;
}

// Strictly preserving the intended order and using the latest banner assets
const BANNERS: BannerItem[] = [
  {
    id: "banner-1",
    src: "/banner1.png",
    alt: "Maghora — Premium Flavoured Makhana. 7 Delicious Flavours, Roasted in Olive Oil",
    objectPositionDesktop: "center center",
    objectPositionMobile: "50% 50%",
  },
  {
    id: "banner-2",
    src: "/banner2.png",
    alt: "Maghora — Bihar's Super Snack, Reimagined. Ancient wetland roots, modern taste",
    objectPositionDesktop: "center center",
    objectPositionMobile: "45% 50%",
  },
  {
    id: "banner-3",
    src: "/banner3.png",
    alt: "Maghora — Explore Our 7 Signature Flavours with Traditional Mithila Folk Art",
    objectPositionDesktop: "center center",
    objectPositionMobile: "50% 50%",
  },
];

export function HeroBanners() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
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
    const timer = setInterval(next, 5500);
    return () => clearInterval(timer);
  }, [next, isPaused]);

  // Touch / swipe support with vertical scroll tolerance
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;

    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) next();
      else prev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const activeBanner = BANNERS[current];

  return (
    <section
      id="hero-carousel"
      className="bg-[#F8EEDC] pt-1.5 sm:pt-4 pb-3 sm:pb-6 select-none relative overflow-hidden"
      aria-label="Maghora Hero Campaign Showcase"
    >
      <div className="mx-auto max-w-7xl px-2.5 sm:px-6 lg:px-8">
        {/*
          Banner Stage: Preserves true native aspect ratio of the 2880x960 campaign visuals,
          with responsive container geometry so no text or packaging is obscured or distorted.
        */}
        <div
          className="relative w-full aspect-[2.85/1] sm:aspect-[2.9/1] lg:aspect-[3/1] min-h-[115px] sm:min-h-[240px] lg:min-h-[380px] rounded-xl sm:rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(51,37,31,0.06)] sm:shadow-[0_12px_40px_rgba(51,37,31,0.08)] border border-[#E8D7BE] bg-[#EEDEC4] group transition-all duration-300"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={activeBanner.id}
              custom={direction}
              initial={{ opacity: 0, scale: 1.01 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 w-full h-full cursor-pointer"
              onClick={handleBannerClick}
            >
              <Image
                src={activeBanner.src}
                alt={activeBanner.alt}
                fill
                priority={current === 0}
                quality={92}
                className="object-contain sm:object-cover w-full h-full select-none"
                style={{
                  objectPosition: activeBanner.objectPositionDesktop,
                }}
                sizes="(min-width: 1280px) 1240px, (min-width: 768px) 94vw, 100vw"
              />
            </motion.div>
          </AnimatePresence>

          {/* Previous Slide Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              prev();
            }}
            className="absolute left-1.5 sm:left-4 top-1/2 -translate-y-1/2 h-7 w-7 sm:h-11 sm:w-11 rounded-full bg-black/35 hover:bg-black/70 text-white backdrop-blur-xs flex items-center justify-center transition-all duration-300 opacity-70 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer shadow-md z-10 active:scale-95"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
          </button>

          {/* Next Slide Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              next();
            }}
            className="absolute right-1.5 sm:right-4 top-1/2 -translate-y-1/2 h-7 w-7 sm:h-11 sm:w-11 rounded-full bg-black/35 hover:bg-black/70 text-white backdrop-blur-xs flex items-center justify-center transition-all duration-300 opacity-70 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer shadow-md z-10 active:scale-95"
            aria-label="Next slide"
          >
            <ChevronRight className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-1.5 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/35 backdrop-blur-xs z-10">
            {BANNERS.map((banner, i) => (
              <button
                key={banner.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goTo(i);
                }}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  i === current
                    ? "w-5 sm:w-8 h-1 sm:h-2 bg-[#E8B84E] shadow-xs"
                    : "w-1.5 sm:w-2.5 h-1 sm:h-2 bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`View slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
