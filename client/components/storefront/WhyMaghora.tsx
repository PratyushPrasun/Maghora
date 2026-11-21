"use client";

import React from "react";
import { MithilaLotus, MithilaBorderRibbon, MithilaCorner } from "./MithilaMotifs";

interface QualityPillar {
  number: string;
  tag: string;
  title: string;
  desc: string;
  accentColor: string;
}

const QUALITY_PILLARS: QualityPillar[] = [
  {
    number: "01",
    tag: "Cooking Medium",
    title: "Olive Oil",
    desc: "Gently slow-roasted exclusively in Olive Oil. We never use palm oil, vanaspati, or blended commercial fats.",
    accentColor: "#702C32",
  },
  {
    number: "02",
    tag: "Terroir Provenance",
    title: "Direct Wetland Farm Sourcing",
    desc: "Procured directly from certified freshwater pond farmers across Mithila, Bihar, ensuring genuine GI-origin jumbo foxnuts.",
    accentColor: "#536B42",
  },
  {
    number: "03",
    tag: "Seasoning Integrity",
    title: "Stone-Ground Spices & Rock Salt",
    desc: "Seasoned only with whole Indian spices ground in small batches and mineral rock salt. Free from synthetic flavour enhancers.",
    accentColor: "#C65D35",
  },
  {
    number: "04",
    tag: "Roasting Technique",
    title: "Gentle Micro-Batch Roasting",
    desc: "Slowly roasted in micro-batches over low thermal stress, producing an airy, delicate crunch with zero greasy residue.",
    accentColor: "#E8B84E",
  },
];

export function WhyMaghora() {
  return (
    <section
      id="why-choose-maghora"
      className="scroll-mt-16 sm:scroll-mt-20 bg-[#F8EEDC] py-8 sm:py-14 border-b border-[#E8D7BE]/70 relative overflow-hidden"
      aria-label="Why Choose Maghora"
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEDEC4]/60 border border-[#E8D7BE] text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.24em] text-[#702C32] mb-2 font-serif">
            <MithilaLotus className="h-3 w-3 text-[#E8B84E]" />
            <span>The Maghora Standard</span>
            <MithilaLotus className="h-3 w-3 text-[#E8B84E]" />
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#33251F]">
            The Art of Roasted Makhana
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#33251F]/70 leading-relaxed">
            Honest ingredients, ancient wetland roots, and uncompromising artisanal standards.
          </p>
        </div>

        {/* 2-Column Asymmetric Ledger Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-10 items-center">
          {/* LEFT: Distinctive Visual Terroir Feature Stage */}
          <div className="lg:col-span-5 relative rounded-2xl sm:rounded-3xl border border-[#E8D7BE] bg-gradient-to-b from-[#FDF9F0] via-[#FAF2E4] to-[#F5E8D3] p-4 sm:p-8 shadow-[0_8px_30px_rgba(112,44,50,0.05)] overflow-hidden text-center flex flex-col justify-between">
            <MithilaCorner className="absolute top-2 left-2 sm:top-3 sm:left-3 h-4 w-4 sm:h-5 sm:w-5 text-[#E8B84E]/70" />
            <MithilaCorner className="absolute top-2 right-2 sm:top-3 sm:right-3 h-4 w-4 sm:h-5 sm:w-5 text-[#E8B84E]/70 rotate-90" />
            <MithilaCorner className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 h-4 w-4 sm:h-5 sm:w-5 text-[#E8B84E]/70 -rotate-90" />
            <MithilaCorner className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 h-4 w-4 sm:h-5 sm:w-5 text-[#E8B84E]/70 rotate-180" />

            <div className="space-y-3 sm:space-y-4 my-auto py-2 sm:py-6">
              <div className="h-14 w-14 sm:h-20 sm:w-20 rounded-2xl bg-white border border-[#E8D7BE] mx-auto flex items-center justify-center shadow-xs">
                <MithilaLotus className="h-8 w-8 sm:h-12 sm:w-12 text-[#702C32]" />
              </div>

              <div>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.24em] text-[#C65D35] font-serif block mb-1">
                  Protected Heritage
                </span>
                <h3 className="font-serif text-xl sm:text-3xl font-bold text-[#702C32] leading-tight">
                  Crafted Without Compromise
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-[#33251F]/75 leading-relaxed max-w-sm mx-auto font-normal">
                Every pouch of Maghora begins in the freshwater <em>pokhars</em> of Mithila and is prepared with culinary reverence. Zero artificial colours, zero cheap oils, only honest flavour.
              </p>

              <div className="pt-1 sm:pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-serif font-bold text-[#702C32]">
                <span>Pure Olive Oil</span>
                <span className="text-[#E8B84E]">✦</span>
                <span>GI Origin</span>
                <span className="text-[#E8B84E]">✦</span>
                <span>Satvik Spices</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Interlocking 4-Pillar Ledger */}
          <div className="lg:col-span-7 space-y-2.5 sm:space-y-3.5">
            {QUALITY_PILLARS.map((pillar) => (
              <div
                key={pillar.number}
                className="group relative rounded-xl sm:rounded-2xl border border-[#E8D7BE] bg-white p-3.5 sm:p-5 shadow-2xs hover:shadow-sm hover:border-[#702C32] transition-all duration-200 flex flex-row items-center gap-3 sm:gap-4"
              >
                {/* Number Badge */}
                <div
                  className="h-9 w-9 sm:h-11 sm:w-11 shrink-0 rounded-xl flex items-center justify-center font-serif text-xs sm:text-sm font-bold text-white shadow-xs transition-transform group-hover:scale-105"
                  style={{ backgroundColor: pillar.accentColor }}
                >
                  {pillar.number}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.14em] sm:tracking-[0.18em] font-serif"
                      style={{ color: pillar.accentColor }}
                    >
                      {pillar.tag}
                    </span>
                  </div>
                  <h4 className="font-serif text-sm sm:text-base font-bold text-[#33251F] group-hover:text-[#702C32] transition-colors leading-snug">
                    {pillar.title}
                  </h4>
                  <p className="mt-0.5 sm:mt-1 text-xs text-[#33251F]/75 leading-relaxed font-normal">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
