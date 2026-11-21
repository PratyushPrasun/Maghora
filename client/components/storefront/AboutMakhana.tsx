"use client";

import React from "react";
import { MithilaLotus, MithilaMatsya, MithilaCorner, MithilaSun } from "./MithilaMotifs";

export function AboutMakhana() {
  return (
    <section
      id="story"
      className="scroll-mt-16 sm:scroll-mt-20 bg-[#FDF9F0] py-8 sm:py-14 border-b border-[#E8D7BE]/70 relative overflow-hidden"
      aria-label="About Makhana & Mithila Heritage"
    >
      {/* Background Ambient Sun Glow */}
      <div className="absolute -top-10 -right-10 opacity-5 pointer-events-none">
        <MithilaSun className="h-72 w-72 text-[#702C32]" />
      </div>

      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEDEC4]/60 border border-[#E8D7BE] text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.24em] text-[#702C32] mb-2 font-serif">
            <MithilaLotus className="h-3 w-3 text-[#E8B84E]" />
            <span>Wetland Terroir of Bihar</span>
            <MithilaLotus className="h-3 w-3 text-[#E8B84E]" />
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#33251F]">
            The Sacred Story of Makhana
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#33251F]/70 leading-relaxed max-w-2xl mx-auto">
            From the tranquil freshwater <em>pokhars</em> of northern Bihar to an elevated modern snacking ritual.
          </p>
        </div>

        {/* 3-Column Visual Narrative Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-stretch">
          {/* Card 1: Aquatic Origins */}
          <div className="relative rounded-2xl sm:rounded-3xl border border-[#E8D7BE] bg-white p-4 sm:p-6 shadow-xs flex flex-col justify-between overflow-hidden group hover:border-[#536B42] transition-colors">
            <MithilaCorner className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#536B42]/50" />
            <MithilaCorner className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#536B42]/50 rotate-90" />

            <div>
              <div className="h-28 sm:h-40 w-full rounded-xl sm:rounded-2xl bg-[#F2F6ED] border border-[#D6E2CD] flex items-center justify-center p-3 sm:p-4 mb-3.5 sm:mb-4 relative overflow-hidden">
                {/* Visual botanical illustration of aquatic lotus pond */}
                <svg viewBox="0 0 160 110" fill="none" className="w-full h-full max-h-28 sm:max-h-36">
                  {/* Pond Waves */}
                  <path
                    d="M10 85 C35 78, 55 92, 80 85 C105 78, 125 92, 150 85"
                    stroke="#536B42"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M15 96 C40 89, 60 103, 85 96 C110 89, 130 103, 155 96"
                    stroke="#536B42"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                  {/* Floating Lotus Pad */}
                  <ellipse cx="80" cy="68" rx="48" ry="14" fill="#536B42" fillOpacity="0.2" />
                  <ellipse cx="80" cy="68" rx="40" ry="10" stroke="#536B42" strokeWidth="1.8" fill="none" />
                  {/* Lotus Blossom */}
                  <path
                    d="M80 32 C72 48, 64 62, 80 66 C96 62, 88 48, 80 32 Z"
                    fill="#702C32"
                  />
                  <path
                    d="M68 44 C60 56, 64 62, 76 64 C72 56, 68 52, 68 44 Z"
                    fill="#C65D35"
                  />
                  <path
                    d="M92 44 C100 56, 96 62, 84 64 C88 56, 92 52, 92 44 Z"
                    fill="#C65D35"
                  />
                  <circle cx="80" cy="18" r="8" stroke="#E8B84E" strokeWidth="1.8" />
                  <circle cx="80" cy="18" r="3.5" fill="#E8B84E" />
                </svg>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#536B42] font-serif">
                  01 · Aquatic Roots
                </span>
              </div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#33251F] mb-1">
                Freshwater Pokhars
              </h3>
              <p className="text-xs text-[#33251F]/75 leading-relaxed font-normal">
                Over 85% of the world&apos;s makhana thrives in the natural freshwater wetland ponds of northern Bihar. Sown in fertile silt, makhana is an ancient aquatic crop celebrated across centuries.
              </p>
            </div>

            <div className="pt-2.5 sm:pt-3 mt-2.5 sm:mt-3 border-t border-[#E8D7BE]/60 flex items-center gap-2 text-[10px] sm:text-[11px] font-medium text-[#536B42]">
              <MithilaMatsya className="h-4 w-4" />
              <span>Wetland aquatic ecosystem</span>
            </div>
          </div>

          {/* Card 2: Generational Popping Craft */}
          <div className="relative rounded-2xl sm:rounded-3xl border border-[#E8D7BE] bg-white p-4 sm:p-6 shadow-xs flex flex-col justify-between overflow-hidden group hover:border-[#C65D35] transition-colors">
            <MithilaCorner className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#C65D35]/50" />
            <MithilaCorner className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#C65D35]/50 rotate-90" />

            <div>
              <div className="h-28 sm:h-40 w-full rounded-xl sm:rounded-2xl bg-[#FAF0E6] border border-[#EAD5C3] flex items-center justify-center p-3 sm:p-4 mb-3.5 sm:mb-4 relative overflow-hidden">
                {/* Visual illustration of traditional roasting pan & fire */}
                <svg viewBox="0 0 160 110" fill="none" className="w-full h-full max-h-28 sm:max-h-36">
                  {/* Iron Roasting Kadai */}
                  <path
                    d="M30 65 C30 92, 130 92, 130 65 L30 65 Z"
                    stroke="#33251F"
                    strokeWidth="2.2"
                    fill="#33251F"
                    fillOpacity="0.1"
                  />
                  <line x1="22" y1="65" x2="138" y2="65" stroke="#33251F" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Popping kernels jumping */}
                  <circle cx="80" cy="50" r="8" stroke="#E8B84E" strokeWidth="2" fill="#FFFDF8" />
                  <circle cx="60" cy="42" r="6.5" stroke="#E8B84E" strokeWidth="2" fill="#FFFDF8" />
                  <circle cx="100" cy="40" r="7" stroke="#E8B84E" strokeWidth="2" fill="#FFFDF8" />
                  {/* Gentle sparks */}
                  <path d="M50 30 L54 24" stroke="#C65D35" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M110 28 L106 22" stroke="#C65D35" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M80 25 L80 18" stroke="#E8B84E" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C65D35] font-serif">
                  02 · Generational Craft
                </span>
              </div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#33251F] mb-1">
                Hand-Graded &amp; Popped
              </h3>
              <p className="text-xs text-[#33251F]/75 leading-relaxed font-normal">
                Harvesting makhana is a delicate craft handed down through generations. Seeds are harvested from pond beds, carefully sun-dried, and popped over controlled heat to create airy jumbo kernels.
              </p>
            </div>

            <div className="pt-2.5 sm:pt-3 mt-2.5 sm:mt-3 border-t border-[#E8D7BE]/60 flex items-center gap-2 text-[10px] sm:text-[11px] font-medium text-[#C65D35]">
              <span className="text-xs">✦</span>
              <span>Traditional thermal popping</span>
            </div>
          </div>

          {/* Card 3: Protected GI Origin & Purity */}
          <div className="relative rounded-2xl sm:rounded-3xl border border-[#E8D7BE] bg-white p-4 sm:p-6 shadow-xs flex flex-col justify-between overflow-hidden group hover:border-[#702C32] transition-colors">
            <MithilaCorner className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#702C32]/50" />
            <MithilaCorner className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#702C32]/50 rotate-90" />

            <div>
              <div className="h-28 sm:h-40 w-full rounded-xl sm:rounded-2xl bg-[#FAF4EA] border border-[#E5D2BA] flex items-center justify-center p-3 sm:p-4 mb-3.5 sm:mb-4 relative overflow-hidden">
                {/* Visual seal of GI Mithila Provenance */}
                <svg viewBox="0 0 160 110" fill="none" className="w-full h-full max-h-28 sm:max-h-36">
                  <circle cx="80" cy="55" r="38" stroke="#702C32" strokeWidth="2" strokeDasharray="3 3" />
                  <circle cx="80" cy="55" r="30" stroke="#E8B84E" strokeWidth="1.8" fill="#F8EEDC" />
                  {/* Central Lotus */}
                  <path
                    d="M80 38 C75 48, 70 56, 80 60 C90 56, 85 48, 80 38 Z"
                    fill="#702C32"
                  />
                  <path
                    d="M72 46 C66 53, 70 58, 78 59 C75 53, 72 50, 72 46 Z"
                    fill="#C65D35"
                  />
                  <path
                    d="M88 46 C94 53, 90 58, 82 59 C85 53, 88 50, 88 46 Z"
                    fill="#C65D35"
                  />
                  <circle cx="80" cy="65" r="2.5" fill="#E8B84E" />
                </svg>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#702C32] font-serif">
                  03 · Certified Terroir
                </span>
              </div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#33251F] mb-1">
                Mithila GI Provenance
              </h3>
              <p className="text-xs text-[#33251F]/75 leading-relaxed font-normal">
                Recognized with the prestigious Geographical Indication (GI) status, Mithila Makhana is treasured for its pristine origin, delicate texture, and natural purity straight from Bihar&apos;s agrarian heartland.
              </p>
            </div>

            <div className="pt-2.5 sm:pt-3 mt-2.5 sm:mt-3 border-t border-[#E8D7BE]/60 flex items-center gap-2 text-[10px] sm:text-[11px] font-medium text-[#702C32]">
              <MithilaLotus className="h-4 w-4 text-[#E8B84E]" />
              <span>Protected GI Origin · Bihar</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
