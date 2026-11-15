"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, ShieldCheck, Flame, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(headlineRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
      })
        .from(
          subtitleRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.5"
        )
        .from(
          badgesRef.current,
          {
            y: 15,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.4"
        )
        .from(
          imageContainerRef.current,
          {
            scale: 0.94,
            opacity: 0,
            duration: 1,
            ease: "back.out(1.4)",
          },
          "-=0.8"
        );

      // Subtle breathing float on hero card
      gsap.to(imageContainerRef.current, {
        y: -10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, containerRef);

    return () => ctx.revert(); // GSAP cleanup
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F3] via-[#FAF8F3] to-[#F3EEE3] pt-12 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32"
    >
      {/* Decorative Warm Ambient Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 -z-10 h-[380px] w-[500px] sm:w-[700px] rounded-full bg-accent/8 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 -z-10 h-[300px] w-[400px] rounded-full bg-primary/8 blur-[90px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent-light px-3.5 py-1.5 text-xs font-semibold text-accent shadow-xs">
              <Sparkles className="h-3.5 w-3.5 animate-spin-slow" />
              <span>Gourmet Makhana Slow-Roasted in Pure Olive Oil</span>
            </div>

            <h1
              ref={headlineRef}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground font-serif leading-[1.12]"
            >
              Snacking reimagined with{" "}
              <span className="text-primary italic font-serif">pure crunch</span> & handcrafted flavours.
            </h1>

            <p
              ref={subtitleRef}
              className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 font-sans"
            >
              Crafted from hand-selected jumbo foxnuts, gently roasted in nutrient-rich olive oil and dusted with signature artisanal spices. Never fried. Zero trans fat. 100% guilt-free satisfaction.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <Link href="/products" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary-hover shadow-md">
                  Explore Flavours
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/#story" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-border">
                  The Maghora Promise
                </Button>
              </Link>
            </div>

            {/* Trust and Social Proof Badges */}
            <div
              ref={badgesRef}
              className="pt-4 border-t border-border/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-8 text-xs text-foreground/80"
            >
              <div className="flex items-center gap-2">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="font-semibold text-foreground">4.9 / 5 Rating</span>
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Zero Artificial Preservatives</span>
              </div>

              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-accent" />
                <span>Rich in Plant Protein</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Product Showcase */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div
              ref={imageContainerRef}
              className="relative w-full max-w-md sm:max-w-lg aspect-square rounded-3xl bg-gradient-to-tr from-[#EFE8DC] via-white to-[#F9F6F0] p-6 sm:p-8 border border-border shadow-xl flex flex-col items-center justify-center overflow-hidden"
            >
              {/* Product Badge */}
              <div className="absolute top-6 left-6 z-10 bg-primary/90 text-primary-foreground text-xs font-bold px-3 py-1 rounded-full backdrop-blur-xs shadow-xs">
                Chef&apos;s Signature Roast
              </div>

              {/* Main Brand Logo Display */}
              <div className="relative w-64 h-64 sm:w-76 sm:h-76 transition-transform hover:scale-105 duration-300">
                <Image
                  src="/Magnora.png"
                  alt="Maghora Flavoured Makhana Signature Pack"
                  fill
                  priority
                  className="object-contain drop-shadow-2xl"
                />
              </div>

              {/* Floating Flavour Pill */}
              <div className="absolute bottom-6 right-6 z-10 bg-card/95 border border-border/80 px-4 py-2 rounded-2xl shadow-lg backdrop-blur-md flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-accent/15 flex items-center justify-center text-accent font-bold text-xs">
                  100%
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Slow Roasted</p>
                  <p className="text-[11px] text-muted-foreground">In Extra Virgin Olive Oil</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

