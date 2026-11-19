"use client";

import React from "react";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import {
  MithilaLotus,
  MithilaMatsya,
  MithilaBorderRibbon,
  MithilaCorner,
  MithilaDivider,
} from "./MithilaMotifs";

export function BrandStatement() {
  const scrollToProducts = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("products");
    if (el) {
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      window.history.pushState(null, "", "#products");
    }
  };

  return (
    <section
      id="brand-statement"
      className="relative bg-[#F7F0E3] pt-10 sm:pt-14 pb-14 sm:pb-20 overflow-hidden"
      aria-label="Brand Introduction — Maghora"
    >
      {/* Top delicate Mithila border */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <MithilaBorderRibbon className="w-full h-3 opacity-75" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Asymmetric Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Bold Tagline, Prominent MAGHORA Title, and Brand Statement */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7">
            {/* Tagline / Eyebrow with Mithila Lotus */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#ECE3D0]/80 border border-[#E2D7C3] text-[11px] font-semibold uppercase tracking-[0.22em] text-[#244C38]">
              <MithilaLotus className="h-3.5 w-3.5 text-[#B85C38]" />
              <span>Sacred Lotus Seed · Mithila Heritage</span>
            </div>

            {/* Prominently Displayed Brand Name */}
            <div>
              <span className="block font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[0.16em] text-[#292820] leading-none mb-3">
                MAGHORA
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-[2.5rem] font-semibold text-[#292820] tracking-tight leading-[1.2]">
                Ancestral foxnuts from the tranquil waters of Bihar, reimagined for the modern Indian palate.
              </h1>
            </div>

            {/* Short Supporting Statement */}
            <p className="text-[15px] sm:text-base text-[#292820]/75 leading-relaxed max-w-xl font-normal">
              Born in the fertile wetland <em>pokhars</em> of northern Mithila, Maghora honours an unbroken agricultural legacy. Every jumbo kernel is slow-roasted in pure extra virgin olive oil and seasoned with stone-ground Indian spices. No palm oil, no chemical flavour dust — only honest, airy crunch rooted in sacred terroir.
            </p>

            {/* Action directing visitors down to #products */}
            <div className="pt-2">
              <Link
                href="/#products"
                onClick={scrollToProducts}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#244C38] hover:bg-[#1A3728] text-[#F7F0E3] text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer group"
              >
                <span>Discover The Roasted Collection</span>
                <ArrowDown className="h-4 w-4 text-[#C49A50] transition-transform group-hover:translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Editorial Heritage Frame with Authentic Mithila Motifs */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl border border-[#E2D7C3] bg-[#FDFBF7] p-7 sm:p-9 shadow-[0_8px_32px_rgba(41,40,32,0.04)]">
              {/* Corner accents */}
              <MithilaCorner className="absolute top-3 left-3 h-6 w-6 text-[#C49A50]/70" />
              <MithilaCorner className="absolute top-3 right-3 h-6 w-6 text-[#C49A50]/70 rotate-90" />
              <MithilaCorner className="absolute bottom-3 left-3 h-6 w-6 text-[#C49A50]/70 -rotate-90" />
              <MithilaCorner className="absolute bottom-3 right-3 h-6 w-6 text-[#C49A50]/70 rotate-180" />

              {/* Terroir Header */}
              <div className="flex items-center justify-between border-b border-[#E2D7C3]/80 pb-4 mb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#C49A50]">
                    The Maghora Ethos
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#292820]">
                    Pure Olive Oil &amp; GI Terroir
                  </h3>
                </div>
                <MithilaMatsya className="h-7 w-7 text-[#244C38]" />
              </div>

              {/* Key Brand Tenets in Editorial List */}
              <ul className="space-y-4">
                <li className="flex items-start gap-3.5">
                  <span className="font-serif text-xs font-bold text-[#B85C38] pt-0.5">
                    01
                  </span>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#292820]">
                      Certified GI-Region Makhana
                    </h4>
                    <p className="text-[13px] text-[#292820]/70 leading-snug mt-0.5">
                      Directly sourced from indigenous wetland cultivators in Mithila for consistent jumbo puff.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <span className="font-serif text-xs font-bold text-[#B85C38] pt-0.5">
                    02
                  </span>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#292820]">
                      100% Extra Virgin Olive Oil
                    </h4>
                    <p className="text-[13px] text-[#292820]/70 leading-snug mt-0.5">
                      Gently dry-roasted in wholesome olive oil. Zero palm oil, vanaspati, or heavy grease.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <span className="font-serif text-xs font-bold text-[#B85C38] pt-0.5">
                    03
                  </span>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#292820]">
                      Stone-Ground Spice Blends
                    </h4>
                    <p className="text-[13px] text-[#292820]/70 leading-snug mt-0.5">
                      Handcrafted with authentic whole Indian seasonings and pink rock salt; no synthetic MSG.
                    </p>
                  </div>
                </li>
              </ul>

              {/* Heritage seal footer */}
              <div className="mt-6 pt-4 border-t border-[#E2D7C3]/80 flex items-center justify-between text-[11px] text-[#292820]/60">
                <span className="italic font-serif">Mithila, Bihar</span>
                <span className="font-medium text-[#244C38]">100% Vegetarian &amp; Gluten-Free</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transitional Divider leading to Section 3 */}
        <MithilaDivider className="mt-14 sm:mt-18" text="Artisanal Roasts" />
      </div>
    </section>
  );
}
