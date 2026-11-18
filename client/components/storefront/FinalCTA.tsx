"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Heart, Sparkles, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MithilaLotus, MithilaDivider } from "./MithilaMotifs";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#292820] text-[#F7F0E3] py-20 sm:py-28 border-t border-[#C49A50]/30">
      {/* Decorative gold circular accents */}
      <div
        className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full border border-[#C49A50]/20"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 -bottom-24 h-96 w-96 rounded-full border border-[#C49A50]/20"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-7">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#C49A50]/40 text-[#C49A50] text-[11px] font-bold uppercase tracking-[0.25em]">
          <MithilaLotus className="h-4 w-4 text-[#C49A50]" />
          <span>The Sovereign Super-Snack of Bihar</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
          Experience the Ancient Crunch,{" "}
          <span className="text-[#C49A50] block mt-2">
            Reimagined in Pure Olive Oil.
          </span>
        </h2>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#F7F0E3]/75 leading-relaxed">
          Order directly from our fresh roasting batches. Seven artisanal flavours prepared with GI-origin Mithila makhana, cold-pressed olive oil, and authentic Indian spices.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/products" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto h-13 px-9 rounded-full bg-[#B85C38] hover:bg-[#9A4928] text-white text-xs font-bold uppercase tracking-wider shadow-lg gap-2 cursor-pointer transition-transform hover:scale-105"
            >
              Shop All Flavours <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <Link href="/categories" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-13 px-8 rounded-full border-[#C49A50] text-[#F7F0E3] hover:bg-[#C49A50] hover:text-[#292820] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Browse Collections
            </Button>
          </Link>
        </div>

        {/* Symmetrical divider */}
        <MithilaDivider className="pt-6" />

        {/* Trust Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-[#F7F0E3]/80 pt-2">
          <div className="flex items-center justify-center gap-2">
            <Leaf className="h-4 w-4 text-[#C49A50]" />
            <span>100% Olive Oil Roast</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#C49A50]" />
            <span>Zero Preservatives</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-[#C49A50]" />
            <span>GI-Belt Mithila Origin</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Heart className="h-4 w-4 text-[#C49A50]" />
            <span>FSSAI Certified Vegetarian</span>
          </div>
        </div>
      </div>
    </section>
  );
}
