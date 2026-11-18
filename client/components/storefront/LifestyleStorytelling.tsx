"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Clock, Coffee, Film, Users, ArrowRight } from "lucide-react";
import { MithilaLotus } from "./MithilaMotifs";
import { Button } from "@/components/ui/button";

interface Ritual {
  id: string;
  time: string;
  icon: any;
  title: string;
  tagline: string;
  story: string;
  recommendedFlavours: string[];
  pairing: string;
  quote: string;
  speaker: string;
}

const RITUALS: Ritual[] = [
  {
    id: "desk-focus",
    time: "4:00 PM",
    icon: Clock,
    title: "The Mindful Desk Fuel",
    tagline: "Crisp, airy energy without keyboard grease or sugar crashes.",
    story: "When the late-afternoon dip hits your desk, reach for a clean snack that respects your productivity. Maghora's olive oil roasted makhana gives you high plant protein and steady complex carbs — never sticky, never heavy.",
    recommendedFlavours: ["Smoky Peri Peri", "Himalayan Salt & Pepper"],
    pairing: "Cold brew or tender coconut water",
    quote: "Maghora has officially replaced biscuits and fried chips across our entire tech design team.",
    speaker: "Studio Archetype, Bengaluru",
  },
  {
    id: "teatime",
    time: "5:30 PM",
    icon: Coffee,
    title: "The Evening Chai Companion",
    tagline: "Honoring India's sacred post-work gathering ritual.",
    story: "Tea in Indian homes is never just a beverage — it is a daily dialogue. Replace oily samosas and fried namkeens with a warm, spiced bowl of Maghora makhana that harmonizes effortlessly with steaming cardamom or adrak chai.",
    recommendedFlavours: ["Fresh Pudina Masala", "Tangy Desi Tomato"],
    pairing: "Hot hand-pounded ginger chai",
    quote: "The Pudina Masala brings back the flavours of my mother's kitchen, yet stays so crisp and light.",
    speaker: "Dr. Alok Nath, Patna",
  },
  {
    id: "midnight",
    time: "10:30 PM",
    icon: Film,
    title: "Guilt-Free Midnight Cinema",
    tagline: "All the satisfying crunch of theater popcorn with none of the remorse.",
    story: "Dim the lights, queue up your favourite cinema or series, and indulge in a generous bowl. Because our makhana is slow-roasted in extra virgin olive oil rather than drenched in artificial palm butter, you sleep light and wake up refreshed.",
    recommendedFlavours: ["Truffle Mac & Cheese", "Sweet Chilli Glaze"],
    pairing: "Sparkling infused water or spiced golden milk",
    quote: "Our movie nights will never go back to microwaved bags. Truffle Mac & Cheese is pure luxury.",
    speaker: "Meera & Siddharth, Mumbai",
  },
  {
    id: "entertaining",
    time: "Festive & Weekend",
    icon: Users,
    title: "The Host's Grazing Platter",
    tagline: "An artisanal conversation-starter on any celebration table.",
    story: "Set apart your hosting with a dedicated makhana flight. Arrange our seven colours and spice blends across ceramic ramekins beside artisanal cheeses, roasted nuts, seasonal berries, and gourmet dips.",
    recommendedFlavours: ["All 7 Signature Flavours Sampler"],
    pairing: "Craft mocktails, ginger ales, and festive spreads",
    quote: "Guests always ask where I discovered these beautiful makhana flavours. It's the ultimate hostess secret.",
    speaker: "Sanyukta Singhania, New Delhi",
  },
];

export function LifestyleStorytelling() {
  const [activeId, setActiveId] = useState<string>("desk-focus");

  const currentRitual = RITUALS.find((r) => r.id === activeId) || RITUALS[0];
  const CurrentIcon = currentRitual.icon;

  return (
    <section id="lifestyle" className="relative bg-[#ECE3D0] py-18 sm:py-26 border-b border-[#E2D7C3] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#B85C38] mb-3">
              <Sparkles className="h-3.5 w-3.5 text-[#C49A50]" />
              <span>Everyday Moments · Reimagined</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#292820] leading-tight">
              Rituals of Crunch.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#6E685C] leading-relaxed">
              Snacking is more than consumption — it is a pause in your day. Discover how Maghora complements every moment between meals.
            </p>
          </div>

          <Link href="/products" className="hidden sm:inline-flex">
            <Button
              variant="outline"
              className="gap-2 rounded-full border-[#C49A50] hover:bg-[#244C38] hover:text-white transition-all text-xs font-semibold uppercase tracking-wider"
            >
              Order for Your Pantry <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Interactive Rituals Selector Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {RITUALS.map((ritual) => {
            const Icon = ritual.icon;
            const isSelected = ritual.id === activeId;
            return (
              <button
                key={ritual.id}
                onClick={() => setActiveId(ritual.id)}
                className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border text-left transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "bg-[#244C38] text-white border-[#244C38] shadow-lg scale-[1.02]"
                    : "bg-white/80 border-[#E2D7C3] text-[#292820] hover:bg-white hover:border-[#C49A50]"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                      isSelected ? "bg-white/15 text-[#C49A50]" : "bg-[#F7F0E3] text-[#B85C38]"
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      isSelected ? "text-[#C49A50]" : "text-[#6E685C]"
                    }`}
                  >
                    {ritual.time}
                  </span>
                </div>
                <h3 className="font-serif text-sm sm:text-base font-bold line-clamp-1">
                  {ritual.title}
                </h3>
              </button>
            );
          })}
        </div>

        {/* Active Ritual Spotlight Feature */}
        <div className="rounded-3xl border border-[#E2D7C3] bg-white p-6 sm:p-10 shadow-[0_12px_40px_-15px_rgba(41,40,32,0.1)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Story text */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE5D7] text-[#244C38] text-xs font-semibold">
                <CurrentIcon className="h-3.5 w-3.5" />
                <span>{currentRitual.time} Ritual</span>
              </div>

              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#292820]">
                  {currentRitual.title}
                </h3>
                <p className="text-sm sm:text-base font-medium text-[#B85C38] mt-1">
                  {currentRitual.tagline}
                </p>
              </div>

              <p className="text-sm sm:text-base text-[#6E685C] leading-relaxed">
                {currentRitual.story}
              </p>

              {/* Pairings & Recommended flavours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E2D7C3]">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#244C38] mb-1.5">
                    Recommended Flavours
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {currentRitual.recommendedFlavours.map((f) => (
                      <span
                        key={f}
                        className="px-2.5 py-1 rounded-full bg-[#F7F0E3] border border-[#E2D7C3] text-xs font-medium text-[#292820]"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#B85C38] mb-1.5">
                    Ideal Beverage Pairing
                  </p>
                  <p className="text-xs text-[#6E685C]">
                    {currentRitual.pairing}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/products">
                  <Button className="rounded-full bg-[#B85C38] hover:bg-[#9A4928] text-white px-7 text-xs font-semibold gap-2">
                    Shop This Moment <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Testimonial Quote Callout */}
            <div className="lg:col-span-5 rounded-2xl bg-[#F7F0E3] p-7 border border-[#E2D7C3] space-y-4">
              <div className="flex items-center gap-2 text-[#C49A50]">
                <MithilaLotus className="h-5 w-5 text-[#C49A50]" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#244C38]">
                  From Our Community
                </span>
              </div>

              <blockquote className="font-serif text-base sm:text-lg italic text-[#292820] leading-snug">
                &ldquo;{currentRitual.quote}&rdquo;
              </blockquote>

              <div className="pt-2 border-t border-[#E2D7C3] text-xs text-[#6E685C] font-semibold">
                — {currentRitual.speaker}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
