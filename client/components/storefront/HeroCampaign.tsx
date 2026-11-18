"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Pause, Play, Compass, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { MithilaLotus, MithilaBorderRibbon } from "./MithilaMotifs";
import { Button } from "@/components/ui/button";

interface HeroSlide {
  id: string;
  src: string;
  alt: string;
  badge: string;
  title: string;
  caption: string;
  href: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    src: "/banner1.png",
    alt: "Maghora Flavoured Makhana - Premium Foxnuts in 7 Signature Flavours",
    badge: "Signature Collection",
    title: "Seven Handcrafted Flavours",
    caption: "Slow-roasted in pure olive oil for the definitive light crunch.",
    href: "/products",
  },
  {
    id: "slide-2",
    src: "/banner2.png",
    alt: "Bihar's Super Snack, Reimagined by Maghora",
    badge: "Mithila Provenance",
    title: "Bihar's Super Snack, Reimagined",
    caption: "Centuries of sacred pond harvests brought into the modern pantry.",
    href: "/#story",
  },
  {
    id: "slide-3",
    src: "/banner3.png",
    alt: "Explore Maghora's 7 Signature Flavours from Peri Peri to Pudina",
    badge: "Artisanal Spice Blends",
    title: "Taste the Spectrum",
    caption: "From Smoky Peri Peri to soothing Pudina Masala & Truffle Mac & Cheese.",
    href: "/products",
  },
];

const AUTOPLAY_INTERVAL = 6000;

export function HeroCampaign() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const heroContentRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setActiveIdx((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIdx((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  // GSAP Entrance animation with proper cleanup & reduced-motion respect
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !heroContentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".hero-anim-item", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.12,
        ease: "power2.out",
        clearProps: "all",
      });
    }, heroContentRef);

    return () => ctx.revert();
  }, []);

  // Slideshow Autoplay
  useEffect(() => {
    if (!isPlaying || isHovered) return;
    const interval = setInterval(nextSlide, AUTOPLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [isPlaying, isHovered, nextSlide]);

  // Touch Swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    touchStartXRef.current = null;
  };

  const currentSlide = HERO_SLIDES[activeIdx];

  return (
    <section
      aria-label="Hero Showcase"
      className="relative overflow-hidden bg-[#F7F0E3] pt-6 pb-12 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-20 border-b border-[#E2D7C3]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative Mithila border ribbons */}
      <MithilaBorderRibbon className="absolute top-0 inset-x-0 h-2.5 opacity-90" />

      {/* Subtle background ambient glow */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#C49A50]/15 to-transparent blur-3xl rounded-full"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* LEFT COLUMN: Editorial Typography & CTAs */}
          <div ref={heroContentRef} className="lg:col-span-6 space-y-6 sm:space-y-7 text-left">
            {/* Provenance Pill */}
            <div className="hero-anim-item inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#C49A50]/50 bg-white/70 backdrop-blur-xs text-[#244C38] shadow-xs">
              <MithilaLotus className="h-4 w-4 text-[#B85C38]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#292820]">
                Mithila Heritage · Slow-Roasted In Olive Oil
              </span>
            </div>

            {/* Headline */}
            <h1 className="hero-anim-item font-serif text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-[#292820] leading-[1.08]">
              The Sacred Crunch of Bihar.{" "}
              <span className="text-[#B85C38] block mt-1">
                Roasted in Pure Olive Oil.
              </span>
            </h1>

            {/* Concise Supporting Description */}
            <p className="hero-anim-item text-base sm:text-lg text-[#6E685C] leading-relaxed max-w-xl">
              Hand-harvested from the ancestral wetlands of Mithila, gently roasted in cold-pressed olive oil, and tossed in 7 handcrafted Indian spice blends. A wholesome, guilt-free super-snack for discerning pantries.
            </p>

            {/* Key Value Badges */}
            <div className="hero-anim-item grid grid-cols-3 gap-2 sm:gap-3 py-1">
              <div className="p-3 rounded-2xl bg-white/70 border border-[#E2D7C3] flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B85C38]">
                  Cooking Medium
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#292820]">
                  100% Olive Oil
                </span>
                <span className="text-[10px] text-[#6E685C]">Zero Palm Oil</span>
              </div>

              <div className="p-3 rounded-2xl bg-white/70 border border-[#E2D7C3] flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#244C38]">
                  Sourcing
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#292820]">
                  Grade-A Jumbo
                </span>
                <span className="text-[10px] text-[#6E685C]">Direct from Mithila</span>
              </div>

              <div className="p-3 rounded-2xl bg-white/70 border border-[#E2D7C3] flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C49A50]">
                  Collection
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#292820]">
                  7 Flavours
                </span>
                <span className="text-[10px] text-[#6E685C]">Artisanal Blends</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="hero-anim-item flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link href="/products" className="shrink-0">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-13 px-8 rounded-full bg-[#B85C38] hover:bg-[#9A4928] text-white font-semibold text-sm tracking-wide shadow-md hover:shadow-lg transition-all gap-2 group cursor-pointer"
                >
                  Shop Now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>

              <Link href="/#story" className="shrink-0">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-13 px-7 rounded-full border-[#C49A50]/70 bg-white/50 hover:bg-white text-[#292820] font-semibold text-sm hover:border-[#B85C38] transition-colors gap-2 cursor-pointer"
                >
                  <Compass className="h-4 w-4 text-[#B85C38]" />
                  Explore Our Story
                </Button>
              </Link>
            </div>

            {/* Assurance footnote */}
            <div className="hero-anim-item flex items-center gap-4 text-xs text-[#6E685C] pt-1">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="h-4 w-4 text-[#244C38]" />
                100% Vegetarian & Gluten Free
              </span>
              <span>•</span>
              <span className="font-medium">Free Shipping above ₹499</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Editorial Campaign Banner Stage */}
          <div className="lg:col-span-6 relative">
            <div
              className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden rounded-[2rem] border-2 border-[#E2D7C3] bg-[#244C38] shadow-[0_20px_50px_-15px_rgba(41,40,32,0.18)] select-none group"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Inner slide with Framer Motion fade */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide.id}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="absolute inset-0 w-full h-full"
                >
                  <Link
                    href={currentSlide.href}
                    className="block relative w-full h-full cursor-pointer"
                    aria-label={currentSlide.alt}
                  >
                    <Image
                      src={currentSlide.src}
                      alt={currentSlide.alt}
                      fill
                      priority={activeIdx === 0}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 640px"
                      className="object-cover sm:object-contain object-center transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  </Link>
                </motion.div>
              </AnimatePresence>

              {/* Top Floating Badge */}
              <div className="absolute top-4 left-4 z-20 pointer-events-none">
                <div className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-[#F7F0E3] flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="h-3 w-3 text-[#C49A50]" />
                  <span className="text-[10px] font-bold tracking-wider uppercase">
                    {currentSlide.badge}
                  </span>
                </div>
              </div>

              {/* Prev / Next navigation arrow buttons */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                aria-label="Previous slide"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/85 backdrop-blur-md text-[#292820] shadow-md border border-white/60 transition-all hover:bg-white hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                aria-label="Next slide"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/85 backdrop-blur-md text-[#292820] shadow-md border border-white/60 transition-all hover:bg-white hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Bottom Carousel Controls: Indicator Pills & Pause/Play */}
              <div className="absolute bottom-3 inset-x-0 z-20 flex items-center justify-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 shadow-sm">
                  {HERO_SLIDES.map((slide, idx) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveIdx(idx);
                      }}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === activeIdx
                          ? "w-7 bg-[#C49A50]"
                          : "w-2 bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPlaying((p) => !p);
                    }}
                    aria-label={isPlaying ? "Pause banner slideshow" : "Play banner slideshow"}
                    className="ml-1 text-white/80 hover:text-white transition-colors p-0.5 cursor-pointer"
                  >
                    {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Mithila Stamp Accent */}
            <div className="absolute -bottom-5 -right-2 sm:-right-4 hidden sm:flex items-center gap-2.5 rounded-2xl border border-[#E2D7C3] bg-white p-3.5 shadow-xl z-20">
              <div className="h-10 w-10 rounded-xl bg-[#244C38] flex items-center justify-center text-[#F7F0E3] shrink-0">
                <MithilaLotus className="h-6 w-6 text-[#C49A50]" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[#292820]">Mithila Certified</p>
                <p className="text-[10px] text-[#6E685C]">Authentic GI Provenance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
