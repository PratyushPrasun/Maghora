"use client";

import React from "react";
import { MithilaLotus, MithilaCorner } from "./MithilaMotifs";

const ABOUT_PILLARS = [
  {
    step: "01",
    title: "What is Makhana?",
    subtitle: "The Sacred Aquatic Seed",
    text: "Makhana, or foxnut, is the popped seed of the aquatic plant Euryale ferox. It thrives naturally in the tranquil freshwater wetland ponds (pokhars) of northern Bihar, where it is hand-harvested from the pond silt and popped using artisanal wood-fire methods.",
  },
  {
    step: "02",
    title: "Sacred Food Culture",
    subtitle: "Revered in Fasting & Festivities",
    text: "For generations, makhana has held an auspicious place in Indian culinary traditions. Revered as pure satvik nourishment, it is traditionally enjoyed during religious fasts (vrat) such as Navratri and Maha Shivratri for its gentle digestibility and wholesome lightness.",
  },
  {
    step: "03",
    title: "Mithila's Living Heritage",
    subtitle: "Paan, Maachh, aur Makhana",
    text: "Bihar's Mithila belt produces over 85% of India's and the world's makhana. Certified with a prestigious Geographical Indication (GI) tag, it represents centuries of agrarian coexistence between local farming communities and the natural aquatic ecosystem.",
  },
  {
    step: "04",
    title: "The Modern Snacking Choice",
    subtitle: "Mindful, Crisp & Naturally Light",
    text: "Today, makhana is celebrated as an honest alternative to heavy, fried potato chips. Naturally gluten-free, a source of plant protein and dietary fiber, its airy crunch provides the perfect canvas for slow-roasting in 100% pure extra virgin olive oil.",
  },
];

export function AboutMakhana() {
  return (
    <section
      id="story"
      className="scroll-mt-20 bg-[#FDFBF7] py-16 sm:py-24 border-t border-[#E2D7C3] relative overflow-hidden"
      aria-label="About Makhana & Mithila Heritage"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F0E3] border border-[#E2D7C3] text-[11px] font-semibold uppercase tracking-[0.22em] text-[#244C38] mb-3">
            <MithilaLotus className="h-3.5 w-3.5 text-[#B85C38]" />
            <span>Ancestral Knowledge · Wetland Ecology</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#292820] leading-tight">
            The Story of Makhana
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#292820]/70 leading-relaxed max-w-2xl mx-auto">
            From the sacred wetland pokhars of northern Bihar to contemporary mindful homes, understand the tradition and journey behind India’s ancient foxnut.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {ABOUT_PILLARS.map((pillar) => (
            <div
              key={pillar.step}
              className="relative rounded-2xl border border-[#E2D7C3] bg-white p-7 sm:p-9 transition-all duration-300 hover:border-[#C49A50]/70 hover:shadow-[0_8px_24px_rgba(41,40,32,0.04)]"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-serif text-sm font-extrabold text-[#B85C38] tracking-wider">
                  {pillar.step}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C49A50]">
                  {pillar.subtitle}
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#292820] mb-2.5">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#292820]/75 leading-relaxed">
                {pillar.text}
              </p>
            </div>
          ))}
        </div>

        {/* Traditional Maithil Cultural Banner */}
        <div className="mt-12 sm:mt-16 relative rounded-2xl border border-[#E2D7C3] bg-[#F7F0E3] p-6 sm:p-8 text-center max-w-3xl mx-auto">
          <MithilaCorner className="absolute top-2.5 left-2.5 h-5 w-5 text-[#C49A50]/60" />
          <MithilaCorner className="absolute top-2.5 right-2.5 h-5 w-5 text-[#C49A50]/60 rotate-90" />
          <MithilaCorner className="absolute bottom-2.5 left-2.5 h-5 w-5 text-[#C49A50]/60 -rotate-90" />
          <MithilaCorner className="absolute bottom-2.5 right-2.5 h-5 w-5 text-[#C49A50]/60 rotate-180" />

          <p className="font-serif italic text-base sm:text-lg text-[#292820] tracking-wide">
            &ldquo;पग-पग पोखर, माछ मखान — Blessed by wetland waters, celebrated in every home.&rdquo;
          </p>
          <p className="mt-2 text-[11px] font-medium tracking-[0.2em] uppercase text-[#244C38]">
            Timeless Maithil Proverb of Abundance
          </p>
        </div>
      </div>
    </section>
  );
}
