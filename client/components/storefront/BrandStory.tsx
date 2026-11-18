"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MithilaLotus, MithilaBorderRibbon, MithilaMatsya } from "./MithilaMotifs";

export function BrandStory() {
  const heritagePillars = [
    {
      title: "Sacred Wetland Pokhars",
      desc: "Harvested from the clean, mineral-rich ponds of Mithila, north Bihar — a GI-recognized sanctuary for makhana for over a thousand years.",
    },
    {
      title: "Roasted Exclusively in Olive Oil",
      desc: "We never use palm oil or industrial deep fryers. Slow-roasted in extra virgin olive oil to lock in crunch while maintaining cardiovascular wellness.",
    },
    {
      title: "Stone-Ground Spice Blends",
      desc: "Seasoned only with whole Indian herbs, sundried tomatoes, tellicherry pepper, and rock salts. Zero artificial flavor enhancers or synthetic MSG.",
    },
  ];

  return (
    <section id="story" className="relative overflow-hidden bg-[#ECE3D0] py-18 sm:py-28 border-b border-[#E2D7C3]">
      <MithilaBorderRibbon className="absolute top-0 inset-x-0 h-2.5 opacity-80" />

      {/* Decorative Water ripples / Matsya water symbols in background */}
      <div className="absolute bottom-6 left-8 opacity-20 pointer-events-none hidden lg:block">
        <MithilaMatsya className="h-28 w-28 text-[#244C38]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Rich Mithila Art & Emblem Presentation */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] border-2 border-[#C49A50]/60 bg-[#244C38] shadow-[0_20px_50px_-15px_rgba(36,76,56,0.3)]">
              {/* Ornate layered inner frame */}
              <div className="absolute inset-4 rounded-[2rem] border border-[#C49A50]/40" aria-hidden="true" />
              <div className="absolute inset-8 rounded-[1.75rem] bg-[#F7F0E3]/95 shadow-inner" aria-hidden="true" />

              {/* Maghora Emblem */}
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-10 text-center">
                <div className="relative h-44 w-44 sm:h-52 sm:w-52 transition-transform duration-700 hover:scale-105">
                  <Image
                    src="/Magnora.png"
                    alt="Maghora Mithila lotus and fish emblem"
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="mt-4 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B85C38]">
                    Darbhanga · Madhubani · Bihar
                  </span>
                  <p className="font-serif text-lg font-bold text-[#292820]">
                    Purity in Every Handful
                  </p>
                </div>
              </div>

              {/* Bottom Gold Plate */}
              <div className="absolute bottom-0 inset-x-0 bg-[#244C38] py-3 text-center border-t border-[#C49A50]/40 z-20">
                <span className="text-[11px] font-bold tracking-[0.2em] text-[#C49A50] uppercase">
                  Mithila Harvest · Modern Luxury
                </span>
              </div>
            </div>

            {/* Floating Heritage Badge */}
            <div className="absolute -bottom-6 -right-3 sm:-right-6 hidden sm:block max-w-[220px] rounded-2xl border border-[#C49A50] bg-white p-4 shadow-xl z-20">
              <div className="flex items-center gap-2 mb-1">
                <MithilaLotus className="h-5 w-5 text-[#B85C38]" />
                <span className="text-xs font-bold text-[#292820]">GI Origin</span>
              </div>
              <p className="text-[11px] text-[#6E685C] leading-relaxed">
                Makhana cultivated and processed in the heart of Mithila.
              </p>
            </div>
          </div>

          {/* Right Column: Editorial Narrative */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7 text-left">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#244C38]">
              <MithilaLotus className="h-4 w-4 text-[#C49A50]" />
              <span>Ancestral Roots · Contemporary Craft</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[3.25rem] font-bold tracking-tight text-[#292820] leading-[1.1]">
              Born in Sacred Waters.{" "}
              <span className="text-[#B85C38] block mt-1">
                Crafted for Modern Living.
              </span>
            </h2>

            <p className="text-base text-[#6E685C] leading-relaxed">
              For over a thousand years, in the quiet wetlands (pokhars) of Mithila, local harvesting communities have waded through morning mist to gather the sacred black seeds of the prickly water lily (*Euryale ferox*).
            </p>

            <p className="text-base text-[#6E685C] leading-relaxed">
              At Maghora, we honor this revered heritage. Rather than subjecting this super-crop to commercial deep fryers and synthetic powdered seasoning, we slow-roast each kernel in cold-pressed extra virgin olive oil and dust it with genuine, stone-ground Indian spices.
            </p>

            {/* 3 Pillars List */}
            <div className="space-y-3.5 pt-2">
              {heritagePillars.map((pillar, i) => (
                <div key={i} className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/70 border border-[#E2D7C3]">
                  <div className="h-6 w-6 rounded-full bg-[#244C38] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-serif text-sm font-bold text-[#292820]">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-[#6E685C] mt-0.5 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center gap-4">
              <Link href="/products">
                <Button
                  size="lg"
                  className="rounded-full bg-[#B85C38] hover:bg-[#9A4928] text-white px-8 text-xs font-semibold uppercase tracking-wider gap-2 shadow-sm"
                >
                  Taste the Heritage <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
