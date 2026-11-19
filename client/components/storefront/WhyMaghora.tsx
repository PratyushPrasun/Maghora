"use client";

import React from "react";
import { Droplet, Award, Sparkles, Flame, Check } from "lucide-react";
import { MithilaLotus } from "./MithilaMotifs";

const BRAND_QUALITIES = [
  {
    icon: Droplet,
    tag: "Cooking Medium",
    title: "100% Extra Virgin Olive Oil",
    desc: "Every kernel is gently roasted in pure olive oil. We never use palm oil, vanaspati, or industrial shortening. Resulting in an airy crunch with zero greasy residue.",
    color: "#B85C38",
  },
  {
    icon: Award,
    tag: "Provenance",
    title: "GI-Origin Mithila Jumbo Makhana",
    desc: "Harvested directly from certified wetland pokhars in Bihar. Hand-sorted to ensure uniform size, fluffy puff, and the elimination of hard unpopped centers.",
    color: "#244C38",
  },
  {
    icon: Sparkles,
    tag: "Seasoning Integrity",
    title: "Stone-Ground Indian Spices",
    desc: "Seasoned only with whole Indian herbs, roasted cumin, sun-dried chilies, and Himalayan pink rock salt. 100% free from synthetic MSG and artificial colors.",
    color: "#C49A50",
  },
  {
    icon: Flame,
    tag: "Craftsmanship",
    title: "Small-Batch Dry Roasting",
    desc: "Gently dry-roasted in artisanal micro-batches under low thermal stress. This preserves the natural lightness and delicate crunch of the foxnut seed.",
    color: "#32644B",
  },
];

export function WhyMaghora() {
  return (
    <section
      id="why-choose-maghora"
      className="bg-[#F7F0E3] py-16 sm:py-24 border-t border-[#E2D7C3] relative overflow-hidden"
      aria-label="Why Choose Maghora"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ECE3D0]/80 border border-[#E2D7C3] text-[11px] font-semibold uppercase tracking-[0.22em] text-[#244C38] mb-3">
            <MithilaLotus className="h-3.5 w-3.5 text-[#B85C38]" />
            <span>The Maghora Standard</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#292820] leading-tight">
            Crafted Without Compromise
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#292820]/70 leading-relaxed max-w-2xl mx-auto">
            Honest ingredients, ancient wetland heritage, and artisanal olive oil roasting. Here is what sets Maghora apart in every packet.
          </p>
        </div>

        {/* 4 Quality Highlights Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {BRAND_QUALITIES.map((quality, idx) => {
            const Icon = quality.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl border border-[#E2D7C3] bg-white p-6 sm:p-7 space-y-4 transition-all duration-300 hover:border-[#C49A50] hover:shadow-[0_10px_30px_rgba(41,40,32,0.06)] flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div
                    className="h-11 w-11 rounded-xl flex items-center justify-center text-white shadow-xs"
                    style={{ backgroundColor: quality.color }}
                  >
                    <Icon className="h-5 w-5 stroke-[2]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C49A50]">
                      {quality.tag}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#292820] mt-1 leading-snug">
                      {quality.title}
                    </h3>
                  </div>
                  <p className="text-xs text-[#292820]/75 leading-relaxed">
                    {quality.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E2D7C3]/60 flex items-center gap-1.5 text-[11px] font-medium text-[#244C38]">
                  <Check className="h-3.5 w-3.5 text-[#244C38] stroke-[2.5]" />
                  <span>Verified Maghora Quality</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
