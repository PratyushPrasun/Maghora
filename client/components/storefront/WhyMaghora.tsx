"use client";

import React from "react";
import {
  Award,
  Droplets,
  Sparkles,
  Utensils,
  Leaf,
  ShieldCheck,
} from "lucide-react";
import { MithilaLotus } from "./MithilaMotifs";

interface WhyChooseItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const WHY_CHOOSE_MAGHORA: WhyChooseItem[] = [
  {
    id: "gi-origin",
    icon: <Award className="h-6 w-6 sm:h-7 sm:w-7 stroke-[1.9]" />,
    title: "GI-Tagged Origin",
    description: "Directly harvested from ancestral freshwater pokhars in Mithila, Bihar.",
  },
  {
    id: "olive-oil",
    icon: <Droplets className="h-6 w-6 sm:h-7 sm:w-7 stroke-[1.9]" />,
    title: "Olive Oil Roasted",
    description: "Slow-roasted exclusively in pure olive oil. Zero palm oil or cheap fats.",
  },
  {
    id: "jumbo-grade",
    icon: <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 stroke-[1.9]" />,
    title: "Jumbo Grade-A",
    description: "Hand-sorted for size and fluffiness to deliver an airy, delicate crunch.",
  },
  {
    id: "artisanal-blends",
    icon: <Utensils className="h-6 w-6 sm:h-7 sm:w-7 stroke-[1.9]" />,
    title: "Artisanal Seasoning",
    description: "Tossed in 7 handcrafted spice blends ground fresh in small batches.",
  },
  {
    id: "clean-satvik",
    icon: <Leaf className="h-6 w-6 sm:h-7 sm:w-7 stroke-[1.9]" />,
    title: "Clean & Satvik",
    description: "Naturally gluten-free, zero cholesterol, and zero chemical preservatives.",
  },
  {
    id: "certified-quality",
    icon: <ShieldCheck className="h-6 w-6 sm:h-7 sm:w-7 stroke-[1.9]" />,
    title: "Certified Quality",
    description: "Hygienically prepared in our licensed roastery & nitrogen-sealed fresh.",
  },
];

export function WhyMaghora() {
  return (
    <section
      id="why-choose-maghora"
      className="scroll-mt-16 sm:scroll-mt-20 bg-[#F8EEDC] py-12 sm:py-18 border-b border-[#E8D7BE]/70 select-none relative overflow-hidden"
      aria-label="Why Choose Maghora"
    >
      <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEDEC4]/60 border border-[#E8D7BE] text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#702C32] mb-2 font-serif">
            <MithilaLotus className="h-3 w-3 text-[#E8B84E]" />
            <span>The Maghora Standard</span>
            <MithilaLotus className="h-3 w-3 text-[#E8B84E]" />
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-wide text-[#702C32] uppercase">
            Why Choose Maghora?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#33251F]/75 leading-relaxed font-serif max-w-xl mx-auto">
            Honest ingredients, ancient wetland wisdom, and uncompromising artisanal roasting standards.
          </p>
        </div>

        {/* 6 Circular Icon Badges in an Elegant Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 lg:gap-6 items-start">
          {WHY_CHOOSE_MAGHORA.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center text-center group cursor-default"
            >
              {/* Circular Maroon Badge */}
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-[#702C32] text-[#F8EEDC] flex items-center justify-center shadow-md ring-4 ring-[#E8D7BE]/50 group-hover:ring-[#E8B84E]/70 group-hover:scale-108 transition-all duration-300">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="font-serif font-bold text-sm sm:text-base text-[#702C32] mt-3.5 sm:mt-4 leading-snug group-hover:text-[#551F24] transition-colors">
                {item.title}
              </h3>

              {/* Description */}
              <p className="mt-1.5 text-xs text-[#33251F]/75 leading-relaxed font-normal max-w-[170px] sm:max-w-[190px] mx-auto">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
