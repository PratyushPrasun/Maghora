"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Gift, Truck, ShieldCheck } from "lucide-react";
import { MithilaLotus } from "./MithilaMotifs";
import { Button } from "@/components/ui/button";

export function PromotionalBanner() {
  return (
    <section className="relative overflow-hidden bg-[#244C38] text-[#F7F0E3] py-14 sm:py-20 border-y border-[#C49A50]/40">
      {/* Decorative Mithila background concentric rings */}
      <div
        className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full border border-[#C49A50]/20"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-6 -top-6 h-52 w-52 rounded-full border border-[#C49A50]/15"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 -bottom-24 h-96 w-96 rounded-full border border-[#C49A50]/20"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Text and Value Prop */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#C49A50]/40 text-[#C49A50] text-[11px] font-bold uppercase tracking-[0.2em]">
              <Gift className="h-3.5 w-3.5" />
              <span>Curated Tasting Experience</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              The Seven Flavours of Mithila.{" "}
              <span className="text-[#C49A50] block mt-1">
                Delivered in One Elegant Box.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-[#F7F0E3]/80 max-w-xl leading-relaxed">
              Cannot decide between Smoky Peri Peri and Truffle Mac & Cheese? Explore our complete spectrum of olive oil roasted foxnuts. Freshly packed in artisanal pouches and sent directly from our roasting ovens.
            </p>

            {/* Privilege badges */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1 text-xs text-[#F7F0E3]/90">
              <span className="flex items-center gap-2 font-medium">
                <Truck className="h-4 w-4 text-[#C49A50]" />
                Free Shipping Above ₹499
              </span>
              <span className="flex items-center gap-2 font-medium">
                <ShieldCheck className="h-4 w-4 text-[#C49A50]" />
                Fresh Roast Guarantee
              </span>
              <span className="flex items-center gap-2 font-medium">
                <Sparkles className="h-4 w-4 text-[#C49A50]" />
                All 7 Artisanal Seasonings
              </span>
            </div>
          </div>

          {/* CTA & Quick Purchase Box */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-4 bg-white/5 border border-[#C49A50]/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xs text-center">
            <div className="relative h-28 w-28 shrink-0">
              <Image
                src="/Magnora.png"
                alt="Maghora Tasting Box"
                fill
                className="object-contain"
              />
            </div>

            <div className="space-y-1">
              <p className="font-serif text-lg font-bold text-white">
                Maghora Discovery Pack
              </p>
              <p className="text-xs text-[#F7F0E3]/70">
                The perfect introduction to mindful snacking.
              </p>
            </div>

            <Link href="/products" className="w-full">
              <Button
                size="lg"
                className="w-full h-12 rounded-full bg-[#C49A50] hover:bg-[#DDB876] text-[#292820] font-bold text-xs uppercase tracking-wider shadow-md gap-2 cursor-pointer"
              >
                Explore Tasting Box <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
