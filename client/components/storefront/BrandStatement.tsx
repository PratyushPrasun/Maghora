"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MithilaLotus, MithilaBorderRibbon, MithilaCorner } from "./MithilaMotifs";

export function BrandStatement() {
  return (
    <section
      id="brand-statement"
      className="relative bg-[#F8EEDC] py-3 sm:py-8 border-b border-[#E8D7BE]/70 overflow-hidden"
      aria-label="Brand Introduction — Maghora"
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Compact Editorial Canvas */}
        <div className="relative rounded-2xl sm:rounded-3xl border border-[#E8D7BE] bg-gradient-to-r from-[#FDF9F0] via-[#F8EEDC] to-[#FDFBF7] p-4 sm:p-7 lg:p-8 shadow-[0_8px_30px_rgba(112,44,50,0.04)] overflow-hidden">
          {/* Subtle Heritage Corner Motifs */}
          <MithilaCorner className="absolute top-2 left-2 sm:top-3.5 sm:left-3.5 h-4 w-4 sm:h-5 sm:w-5 text-[#E8B84E]/70" />
          <MithilaCorner className="absolute top-2 right-2 sm:top-3.5 sm:right-3.5 h-4 w-4 sm:h-5 sm:w-5 text-[#E8B84E]/70 rotate-90" />
          <MithilaCorner className="absolute bottom-2 left-2 sm:bottom-3.5 sm:left-3.5 h-4 w-4 sm:h-5 sm:w-5 text-[#E8B84E]/70 -rotate-90" />
          <MithilaCorner className="absolute bottom-2 right-2 sm:bottom-3.5 sm:right-3.5 h-4 w-4 sm:h-5 sm:w-5 text-[#E8B84E]/70 rotate-180" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-center">
            {/* LEFT / CENTER: Dominant Brand Identity & Tagline */}
            <div className="lg:col-span-8 space-y-2.5 sm:space-y-4 text-center lg:text-left">
              {/* Sacred Origin Eyebrow */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#EEDEC4]/60 border border-[#E8D7BE] text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.16em] sm:tracking-[0.24em] text-[#702C32]">
                <MithilaLotus className="h-3 w-3 text-[#E8B84E]" />
                <span>Sacred Terroir of Mithila, Bihar</span>
                <MithilaLotus className="h-3 w-3 text-[#E8B84E]" />
              </div>

              {/* Dominant MAGHORA Brand Name */}
              <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-1 sm:gap-4 justify-center lg:justify-start">
                <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-[0.14em] sm:tracking-[0.18em] text-[#702C32] leading-none select-none drop-shadow-xs">
                  MAGHORA
                </h1>
                <span className="text-[9px] sm:text-xs font-serif font-bold uppercase tracking-[0.18em] sm:tracking-[0.24em] text-[#C65D35]">
                  Artisanal Roasted Makhana
                </span>
              </div>

              {/* Chosen Hinglish Tagline */}
              <p className="font-serif text-base sm:text-2xl lg:text-3xl font-bold text-[#33251F] leading-snug sm:leading-tight tracking-tight">
                &ldquo;Mithila ki mitti,{" "}
                <span className="text-[#702C32] underline decoration-[#E8B84E] decoration-2 underline-offset-4">
                  Maghora ka swaad.
                </span>
                &rdquo;
              </p>

              {/* Poetic & Concise Editorial Copy */}
              <p className="text-xs sm:text-sm text-[#33251F]/80 leading-relaxed font-normal max-w-2xl mx-auto lg:mx-0">
                Harvested from the freshwater <em>pokhars</em> of northern Bihar. Gently slow-roasted in Olive Oil and dusted with stone-ground Indian spices. Pure satvik crunch in every handful.
              </p>
            </div>

            {/* RIGHT: Visual Brand Artifact & Quality Seals */}
            <div className="lg:col-span-4 flex flex-row lg:flex-col items-center justify-center gap-3 sm:gap-4 pt-1 sm:pt-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative h-16 w-16 sm:h-24 sm:w-24 shrink-0 rounded-2xl bg-white border border-[#E8D7BE] p-1.5 sm:p-2 shadow-xs flex items-center justify-center group"
              >
                <div className="relative w-full h-full">
                  <Image
                    src="/logo.png"
                    alt="Maghora Brand Seal"
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </motion.div>

              {/* 3 Compact Terroir Micro-Pills */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2">
                <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/80 border border-[#E8D7BE] text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[#702C32]">
                  Olive Oil
                </span>
                <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/80 border border-[#E8D7BE] text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[#536B42]">
                  Slow Roasted
                </span>
                <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/80 border border-[#E8D7BE] text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[#C65D35]">
                  Zero Palm Oil
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
