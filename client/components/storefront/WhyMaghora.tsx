"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, X, ShieldCheck, Droplet, Sparkles, Heart, Award, ArrowRight } from "lucide-react";
import { MithilaLotus } from "./MithilaMotifs";
import { Button } from "@/components/ui/button";

const COMPARISONS = [
  {
    parameter: "Roasting Medium",
    maghora: "100% Extra Virgin Olive Oil (Pure & Heart-Friendly)",
    market: "Cheap Palm Oil or Vanaspati (High Saturated Fats)",
  },
  {
    parameter: "Foxnut Selection",
    maghora: "Grade-A GI Mithila Jumbo Kernels (Fluffy & Uniform)",
    market: "Mixed, broken kernels with hard chewy unpopped centers",
  },
  {
    parameter: "Seasoning Integrity",
    maghora: "Stone-ground whole Indian spices & aged cheeses",
    market: "Synthetic flavour powders, MSG & chemical maltodextrin",
  },
  {
    parameter: "Nutritional Cleanliness",
    maghora: "0g Trans Fat, Gluten-Free, Clean & Digestible",
    market: "Heavy calorie load, greasy residue, afternoon crashes",
  },
  {
    parameter: "Processing Method",
    maghora: "Slow dry-roasting in small artisanal micro-batches",
    market: "Mass industrial flash-frying at high thermal stress",
  },
];

const BENEFIT_TILES = [
  {
    icon: Droplet,
    tag: "Cooking Medium",
    title: "100% Pure Olive Oil",
    desc: "Gently roasted in extra virgin olive oil. Never deep-fried in palm oil. Zero greasy fingers.",
    accent: "#B85C38",
  },
  {
    icon: Award,
    tag: "Provenance",
    title: "GI-Origin Mithila Foxnuts",
    desc: "Harvested directly from certified wetland farmers in Bihar. Highest grade jumbo crunch.",
    accent: "#244C38",
  },
  {
    icon: Sparkles,
    tag: "Ingredients",
    title: "Zero Preservatives",
    desc: "100% natural Indian spice blends, sun-dried herbs, and pink rock salt. No artificial colors.",
    accent: "#C49A50",
  },
  {
    icon: Heart,
    tag: "Wellness",
    title: "Naturally Nourishing",
    desc: "High plant-based protein, rich in calcium and dietary fiber. 100% vegetarian & gluten-free.",
    accent: "#4B7258",
  },
];

export function WhyMaghora() {
  const [activeTab, setActiveTab] = useState<"matrix" | "pillars">("matrix");

  return (
    <section id="why-us" className="relative bg-[#F7F0E3] py-18 sm:py-26 border-b border-[#E2D7C3] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#244C38] mb-3">
            <MithilaLotus className="h-3.5 w-3.5 text-[#C49A50]" />
            <span>The Maghora Standard</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#292820] leading-tight">
            Why Discerning Snackers Choose Maghora.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6E685C] leading-relaxed">
            We reimagined everyday snacking from the ground up: uncompromised ingredients, ancestral heritage, and pure olive oil roasting.
          </p>

          {/* Toggle View */}
          <div className="mt-6 inline-flex p-1 rounded-full bg-white border border-[#E2D7C3]">
            <button
              onClick={() => setActiveTab("matrix")}
              className={`px-5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === "matrix"
                  ? "bg-[#244C38] text-white shadow-xs"
                  : "text-[#6E685C] hover:text-[#292820]"
              }`}
            >
              The Comparison
            </button>
            <button
              onClick={() => setActiveTab("pillars")}
              className={`px-5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === "pillars"
                  ? "bg-[#244C38] text-white shadow-xs"
                  : "text-[#6E685C] hover:text-[#292820]"
              }`}
            >
              The 4 Pillars
            </button>
          </div>
        </div>

        {/* VIEW 1: SIDE-BY-SIDE MATRIX */}
        {activeTab === "matrix" && (
          <div className="rounded-3xl border border-[#E2D7C3] bg-white overflow-hidden shadow-[0_12px_40px_-15px_rgba(41,40,32,0.08)]">
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-[#244C38] text-white text-xs font-bold uppercase tracking-wider py-4 px-6 sm:px-8 border-b border-[#C49A50]/30">
              <div className="col-span-4 sm:col-span-3 text-[#C49A50]">Standard</div>
              <div className="col-span-5 sm:col-span-5 text-[#F7F0E3] flex items-center gap-1.5">
                <MithilaLotus className="h-3.5 w-3.5 text-[#C49A50]" />
                <span>The Maghora Way</span>
              </div>
              <div className="col-span-3 sm:col-span-4 text-white/60">Typical Market Snack</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-[#E2D7C3]/70">
              {COMPARISONS.map((row, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-12 items-center py-4 sm:py-5 px-6 sm:px-8 transition-colors ${
                    idx % 2 === 0 ? "bg-white" : "bg-[#F7F0E3]/35"
                  }`}
                >
                  <div className="col-span-4 sm:col-span-3 font-serif font-bold text-xs sm:text-sm text-[#292820]">
                    {row.parameter}
                  </div>

                  <div className="col-span-5 sm:col-span-5 flex items-start gap-2 pr-2">
                    <div className="h-5 w-5 rounded-full bg-[#DCE5D7] text-[#244C38] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-[#244C38] leading-snug">
                      {row.maghora}
                    </span>
                  </div>

                  <div className="col-span-3 sm:col-span-4 flex items-start gap-2 text-xs sm:text-sm text-[#6E685C] leading-snug">
                    <div className="h-5 w-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                      <X className="h-3.5 w-3.5 stroke-[2.5]" />
                    </div>
                    <span className="line-through decoration-red-400/50 hidden sm:inline">
                      {row.market}
                    </span>
                    <span className="sm:hidden text-[11px] line-through text-red-700/70">
                      Fried / Mixed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: 4 PILLARS CARDS */}
        {activeTab === "pillars" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFIT_TILES.map((tile, i) => {
              const Icon = tile.icon;
              return (
                <div
                  key={i}
                  className="rounded-3xl border border-[#E2D7C3] bg-white p-6 sm:p-7 space-y-4 hover:border-[#C49A50] hover:shadow-lg transition-all"
                >
                  <div
                    className="h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-xs"
                    style={{ backgroundColor: tile.accent }}
                  >
                    <Icon className="h-6 w-6 stroke-[1.8]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E685C]">
                      {tile.tag}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#292820] mt-0.5">
                      {tile.title}
                    </h3>
                  </div>
                  <p className="text-xs text-[#6E685C] leading-relaxed">
                    {tile.desc}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA bar */}
        <div className="mt-10 sm:mt-12 text-center">
          <Link href="/products">
            <Button
              size="lg"
              className="rounded-full bg-[#B85C38] hover:bg-[#9A4928] text-white px-8 text-xs font-semibold uppercase tracking-wider gap-2 shadow-sm"
            >
              Experience the Maghora Difference <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
