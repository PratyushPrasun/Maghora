import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  MithilaLotus,
  MithilaMatsya,
  MithilaBorderRibbon,
  MithilaCorner,
  MithilaSun,
  MithilaPeacock,
} from "@/components/storefront/MithilaMotifs";
import { ArrowRight, ShieldCheck, Heart, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Maghora — Traditional Mithila Roots, Modern Premium Food",
  description:
    "Discover the story of Maghora: From the tranquil freshwater pokhars of Mithila, Bihar to artisanal makhana slow-roasted in 100% extra virgin olive oil.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="bg-[#F8EEDC] text-[#33251F] min-h-screen">
      {/* 1. FULL-WIDTH EDGE-TO-EDGE BANNER */}
      {/* Fills entire viewport width with zero side margins */}
      <section
        className="w-full relative overflow-hidden bg-[#EEDEC4]"
        aria-label="About Maghora Banner"
      >
        <div className="relative w-full aspect-[2.7/1] sm:aspect-[2.75/1] md:aspect-[2.81/1] min-h-[115px] sm:min-h-[260px] lg:min-h-[460px]">
          <Image
            src="/banner4.png"
            alt="Maghora — Bihar's Super Snack, Reimagined. Ancient wetland roots, modern taste"
            fill
            priority
            quality={94}
            className="object-contain sm:object-cover object-center w-full h-full select-none"
            sizes="100vw"
          />
        </div>
      </section>

      {/* SECTION 1: OUR BEGINNING — Editorial Introduction */}
      <section className="py-8 sm:py-16 border-b border-[#E8D7BE]/70 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14 items-center">
            {/* Left: Artistic Framing & Crest */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl sm:rounded-3xl border border-[#E8D7BE] bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E8] to-[#F5ECE0] p-5 sm:p-10 shadow-[0_12px_36px_rgba(112,44,50,0.06)] text-center overflow-hidden">
                <MithilaCorner className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 h-5 w-5 sm:h-6 sm:w-6 text-[#E8B84E]" />
                <MithilaCorner className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 h-5 w-5 sm:h-6 sm:w-6 text-[#E8B84E] rotate-90" />
                <MithilaCorner className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 h-5 w-5 sm:h-6 sm:w-6 text-[#E8B84E] -rotate-90" />
                <MithilaCorner className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 h-5 w-5 sm:h-6 sm:w-6 text-[#E8B84E] rotate-180" />

                <div className="relative h-20 w-20 sm:h-28 sm:w-28 mx-auto mb-3 sm:mb-4">
                  <Image
                    src="/logo.png"
                    alt="Maghora Crest"
                    fill
                    className="object-contain"
                  />
                </div>

                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.26em] text-[#C65D35] font-serif block mb-1">
                  Est. Mithila, Bihar
                </span>
                <h3 className="font-serif text-xl sm:text-3xl font-extrabold text-[#702C32] tracking-wider">
                  MAGHORA
                </h3>
                <p className="mt-1.5 sm:mt-2 text-xs text-[#7B685F] leading-relaxed font-normal">
                  Honouring the sacred aquatic harvesting tradition of Bihar.
                </p>

                <div className="mt-4 sm:mt-6 pt-3.5 sm:pt-5 border-t border-[#E8D7BE]/60 flex items-center justify-center gap-2 text-xs font-serif font-bold text-[#702C32]">
                  <MithilaLotus className="h-4 w-4 text-[#E8B84E]" />
                  <span>Swaad Mithila Ka</span>
                  <MithilaLotus className="h-4 w-4 text-[#E8B84E]" />
                </div>
              </div>
            </div>

            {/* Right: Narrative Story */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEDEC4]/60 border border-[#E8D7BE] text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.24em] text-[#702C32] font-serif">
                <span>01 · Our Beginning</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#33251F] leading-tight">
                How Maghora Came to Life
              </h2>

              <p className="text-xs sm:text-base text-[#33251F]/80 leading-relaxed font-normal">
                For centuries, makhana (foxnut) was celebrated in Bihar as a sacred offering and an extraordinary dietary staple. Yet, in modern supermarket aisles, we noticed something troubling: this noble superfood was either submerged in palm oil, masked by artificial flavour powders, or packed into generic plastic packets without pride of origin.
              </p>

              <p className="text-xs sm:text-base text-[#33251F]/80 leading-relaxed font-normal">
                Maghora was founded with a singular conviction: to reimagine Bihar&apos;s ancient snack for the contemporary world. We made a strict rule from day one — zero industrial cooking oils, zero artificial additives, and direct partnership with the wetland farming communities who have cultivated this crop for generations.
              </p>

              <div className="pt-1 sm:pt-2">
                <blockquote className="border-l-2 border-[#702C32] pl-3 sm:pl-4 italic text-xs sm:text-sm text-[#702C32] font-serif leading-relaxed">
                  &ldquo;Mithila ki mitti, Maghora ka swaad — preserving ancestral terroir while bringing modern culinary finesse to every pouch.&rdquo;
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: OUR ROOTS — Connection with Bihar, Mithila & Wetland Traditions */}
      <section className="py-8 sm:py-16 bg-[#FDF9F0] border-b border-[#E8D7BE]/70 relative overflow-hidden">
        <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-5 pointer-events-none hidden lg:block">
          <MithilaPeacock className="h-80 w-80 text-[#702C32]" />
        </div>

        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEDEC4]/60 border border-[#E8D7BE] text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.24em] text-[#536B42] mb-2 font-serif">
              <MithilaMatsya className="h-3.5 w-3.5" />
              <span>02 · Our Roots</span>
              <MithilaMatsya className="h-3.5 w-3.5" />
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#33251F]">
              Deeply Rooted in Mithila
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-[#33251F]/70 leading-relaxed">
              Mithila is not just a place on the map; it is a living civilizational rhythm where water, soil, art, and food coexist in harmony.
            </p>
          </div>

          {/* 3 Heritage Story Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="rounded-2xl sm:rounded-3xl border border-[#E8D7BE] bg-white p-4 sm:p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-[#536B42] text-[#F8EEDC] flex items-center justify-center mb-3 sm:mb-4 shadow-xs font-serif font-bold text-xs sm:text-sm">
                  85%
                </div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#33251F] mb-1.5">
                  The Global Heartland
                </h3>
                <p className="text-xs sm:text-sm text-[#33251F]/75 leading-relaxed font-normal">
                  Over 85% of the world&apos;s makhana thrives in the serene freshwater ponds (<em>pokhars</em>) of northern Bihar. The humid climate, nutrient-rich silt, and calm waters form a terroir that cannot be replicated anywhere else on earth.
                </p>
              </div>
              <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-[#E8D7BE]/60 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#536B42]">
                Geographical Indication (GI) Protected
              </div>
            </div>

            <div className="rounded-2xl sm:rounded-3xl border border-[#E8D7BE] bg-white p-4 sm:p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-[#C65D35] text-white flex items-center justify-center mb-3 sm:mb-4 shadow-xs font-serif font-bold text-xs sm:text-sm">
                  手
                </div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#33251F] mb-1.5">
                  The Mallah Harvesters
                </h3>
                <p className="text-xs sm:text-sm text-[#33251F]/75 leading-relaxed font-normal">
                  Makhana seeds grow under water, nestled within prickly pods on the pond floor. Harvesters from the Mallah community dive into the wetlands to gather the seeds, wash them in bamboo sieves, and carefully grade each batch by hand.
                </p>
              </div>
              <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-[#E8D7BE]/60 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#C65D35]">
                Ancestral Aquatic Craft
              </div>
            </div>

            <div className="rounded-2xl sm:rounded-3xl border border-[#E8D7BE] bg-white p-4 sm:p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-[#702C32] text-[#F8EEDC] flex items-center justify-center mb-3 sm:mb-4 shadow-xs font-serif font-bold text-xs sm:text-sm">
                  ✦
                </div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#33251F] mb-1.5">
                  Madhubani Folk Heritage
                </h3>
                <p className="text-xs sm:text-sm text-[#33251F]/75 leading-relaxed font-normal">
                  Just as Mithila artists narrate life through intricate double lines and natural pigments on handmade paper, Maghora crafts its recipes with the same patient artistry, reverence for nature, and cultural storytelling.
                </p>
              </div>
              <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-[#E8D7BE]/60 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#702C32]">
                Folk Artistry × Food Design
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: OUR VISION — Ancient Superfood Meets Modern Connoisseur */}
      <section className="py-8 sm:py-16 border-b border-[#E8D7BE]/70 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="rounded-2xl sm:rounded-3xl border border-[#E8D7BE] bg-gradient-to-r from-[#FDF9F0] via-[#FAF2E4] to-[#F5ECE0] p-4 sm:p-10 lg:p-12 shadow-[0_8px_30px_rgba(112,44,50,0.05)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
              <div className="lg:col-span-8 space-y-3 sm:space-y-4 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEDEC4]/60 border border-[#E8D7BE] text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.24em] text-[#702C32] font-serif">
                  <span>03 · Our Vision</span>
                </div>

                <h2 className="font-serif text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#33251F]">
                  India&apos;s Heritage Snack on the World Stage
                </h2>

                <p className="text-xs sm:text-sm text-[#33251F]/80 leading-relaxed font-normal">
                  We believe traditional Indian superfoods should never feel antiquated, dull, or compromised by mass-commercial shortcuts. Our vision is to elevate makhana into an internationally coveted gourmet food brand that stands alongside artisanal popcorn, handcrafted crisps, and fine pantry snacks.
                </p>

                <p className="text-xs sm:text-sm text-[#33251F]/80 leading-relaxed font-normal">
                  By championing pure extra virgin olive oil, ethical wetland farm sourcing, and stone-ground spices, we want every conscious eater to enjoy real crunch without guilt, grease, or artificial regret.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col items-center justify-center gap-2 sm:gap-3 text-center pt-2 sm:pt-0">
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-[#702C32] text-[#F8EEDC] flex items-center justify-center shadow-md">
                  <MithilaLotus className="h-8 w-8 sm:h-10 sm:w-10 text-[#E8B84E]" />
                </div>
                <span className="font-serif text-base sm:text-lg font-bold text-[#702C32]">
                  Pure Satvik Crunch
                </span>
                <span className="text-[10px] sm:text-[11px] text-[#7B685F] uppercase tracking-[0.18em] sm:tracking-[0.2em] font-semibold">
                  Zero Palm Oil · 100% Olive Oil
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: OUR APPROACH — Traditional Roots Meet Modern Flavours */}
      <section className="py-8 sm:py-16 bg-[#FDF9F0] border-b border-[#E8D7BE]/70 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEDEC4]/60 border border-[#E8D7BE] text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.24em] text-[#C65D35] mb-2 font-serif">
              <span>04 · Our Approach</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#33251F]">
              The Craft Behind the Crunch
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-[#33251F]/70 leading-relaxed">
              Every detail is calibrated to protect the delicate structure of the popped lotus kernel.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {/* Step 1 */}
            <div className="rounded-xl sm:rounded-2xl border border-[#E8D7BE] bg-white p-4 sm:p-5 shadow-xs space-y-2">
              <span className="font-serif text-[11px] sm:text-xs font-bold text-[#702C32] uppercase tracking-[0.2em] block">
                Step 1
              </span>
              <h3 className="font-serif text-sm sm:text-base font-bold text-[#33251F]">
                Hand-Graded Jumbo Sort
              </h3>
              <p className="text-xs text-[#33251F]/75 leading-relaxed font-normal">
                Only uniformly popped, premium jumbo kernels make it to our seasoning kettles.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-xl sm:rounded-2xl border border-[#E8D7BE] bg-white p-4 sm:p-5 shadow-xs space-y-2">
              <span className="font-serif text-[11px] sm:text-xs font-bold text-[#536B42] uppercase tracking-[0.2em] block">
                Step 2
              </span>
              <h3 className="font-serif text-sm sm:text-base font-bold text-[#33251F]">
                100% Extra Virgin Olive Oil
              </h3>
              <p className="text-xs text-[#33251F]/75 leading-relaxed font-normal">
                Slowly tossed in pure olive oil for an airy crunch without heavy saturated fats.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-xl sm:rounded-2xl border border-[#E8D7BE] bg-white p-4 sm:p-5 shadow-xs space-y-2">
              <span className="font-serif text-[11px] sm:text-xs font-bold text-[#C65D35] uppercase tracking-[0.2em] block">
                Step 3
              </span>
              <h3 className="font-serif text-sm sm:text-base font-bold text-[#33251F]">
                Stone-Ground Spices
              </h3>
              <p className="text-xs text-[#33251F]/75 leading-relaxed font-normal">
                Seasoned with Himalayan pink salt, stone-ground black pepper, and authentic Indian herbs.
              </p>
            </div>

            {/* Step 4 */}
            <div className="rounded-xl sm:rounded-2xl border border-[#E8D7BE] bg-white p-4 sm:p-5 shadow-xs space-y-2">
              <span className="font-serif text-[11px] sm:text-xs font-bold text-[#E8B84E] uppercase tracking-[0.2em] block">
                Step 4
              </span>
              <h3 className="font-serif text-sm sm:text-base font-bold text-[#33251F]">
                Gentle Micro-Batch Seal
              </h3>
              <p className="text-xs text-[#33251F]/75 leading-relaxed font-normal">
                Sealed fresh in moisture-barrier pouches to preserve farm-fresh crispness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: OUR PROMISE & CTA */}
      <section className="py-8 sm:py-16 relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-3 sm:px-6 lg:px-8 text-center">
          <div className="rounded-2xl sm:rounded-3xl border border-[#E8D7BE] bg-white p-5 sm:p-12 shadow-[0_12px_40px_rgba(112,44,50,0.06)] relative overflow-hidden">
            <MithilaCorner className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 h-5 w-5 sm:h-6 sm:w-6 text-[#E8B84E]" />
            <MithilaCorner className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 h-5 w-5 sm:h-6 sm:w-6 text-[#E8B84E] rotate-90" />
            <MithilaCorner className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 h-5 w-5 sm:h-6 sm:w-6 text-[#E8B84E] -rotate-90" />
            <MithilaCorner className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 h-5 w-5 sm:h-6 sm:w-6 text-[#E8B84E] rotate-180" />

            <div className="max-w-xl mx-auto space-y-3 sm:space-y-4">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.22em] sm:tracking-[0.26em] text-[#702C32] font-serif block">
                05 · Our Promise
              </span>

              <h2 className="font-serif text-xl sm:text-3xl lg:text-4xl font-bold text-[#33251F]">
                The Maghora Purity Pledge
              </h2>

              <p className="text-xs sm:text-sm text-[#33251F]/80 leading-relaxed font-normal">
                We promise transparency, genuine Mithila provenance, and zero cheap filler oils. If it isn&apos;t good enough for our own families, it never goes into a Maghora bag.
              </p>

              <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Link
                  href="/#products"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#702C32] hover:bg-[#551F24] text-[#F8EEDC] text-xs font-serif font-bold uppercase tracking-[0.18em] sm:tracking-[0.2em] shadow-md transition-all active:scale-95 cursor-pointer min-h-[44px]"
                >
                  <span>Explore Our Flavours</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[#E8D7BE] bg-white text-[#33251F] hover:bg-[#F8EEDC] text-xs font-serif font-bold uppercase tracking-[0.18em] sm:tracking-[0.2em] transition-all cursor-pointer min-h-[44px]"
                >
                  <span>Contact Our Team</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
