"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Flame, Heart, Coffee, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MithilaLotus } from "./MithilaMotifs";

interface FlavourItem {
  id: string;
  name: string;
  hindiName: string;
  tagline: string;
  spiceLevel: "Mild" | "Medium" | "Bold";
  tasteNotes: string;
  ingredients: string[];
  pairing: string;
  accentColor: string;
  bgGrad: string;
}

const SIGNATURE_FLAVOURS: FlavourItem[] = [
  {
    id: "peri-peri",
    name: "Smoky Peri Peri",
    hindiName: "पेरी पेरी",
    tagline: "Fiery birds eye chilli roasted with Mithila black salt and garlic.",
    spiceLevel: "Bold",
    tasteNotes: "Vibrant chili kick with an aromatic citrus undertone and smoky warmth.",
    ingredients: ["Bird's Eye Chilli", "Mithila Rock Salt", "Roasted Garlic", "Pure Olive Oil"],
    pairing: "Chilled fresh lemonade or sparkling water",
    accentColor: "#B85C38",
    bgGrad: "from-[#B85C38]/15 via-[#B85C38]/5 to-transparent",
  },
  {
    id: "mac-cheese",
    name: "Truffle Mac & Cheese",
    hindiName: "मैक एंड चीज़",
    tagline: "Indulgent aged cheddar with white truffle essence and velvety crunch.",
    spiceLevel: "Mild",
    tasteNotes: "Decadent creaminess layered over the light, airy snap of slow-roasted foxnuts.",
    ingredients: ["Aged Cheddar", "Sweet Whey", "White Truffle Aroma", "Olive Oil"],
    pairing: "Evening gatherings or artisanal craft coolers",
    accentColor: "#C49A50",
    bgGrad: "from-[#C49A50]/15 via-[#C49A50]/5 to-transparent",
  },
  {
    id: "sweet-chilli",
    name: "Sweet Chilli Glaze",
    hindiName: "स्वीट चिली",
    tagline: "Caramelized desi jaggery notes balanced with crushed red pepper.",
    spiceLevel: "Medium",
    tasteNotes: "Delightful play between subtle sweet notes and a pleasant chili warmth.",
    ingredients: ["Organic Jaggery", "Kashmiri Red Chilli", "Sea Salt", "Olive Oil"],
    pairing: "Steaming spiced masala chai",
    accentColor: "#CF7653",
    bgGrad: "from-[#CF7653]/15 via-[#CF7653]/5 to-transparent",
  },
  {
    id: "salt-pepper",
    name: "Himalayan Salt & Pepper",
    hindiName: "नमक व काली मिर्च",
    tagline: "Pristine pink rock salt with coarse cracked Tellicherry peppercorns.",
    spiceLevel: "Mild",
    tasteNotes: "Purity defined. Highlights the natural nutty sweetness of fresh foxnuts.",
    ingredients: ["Pink Himalayan Salt", "Tellicherry Black Pepper", "Olive Oil"],
    pairing: "Strong ginger tea or green tea",
    accentColor: "#244C38",
    bgGrad: "from-[#244C38]/15 via-[#244C38]/5 to-transparent",
  },
  {
    id: "cream-onion",
    name: "Cream & Spring Onion",
    hindiName: "क्रीम व अनियन",
    tagline: "Velvety sour cream essence folded with fragrant garden chives.",
    spiceLevel: "Mild",
    tasteNotes: "Silky smooth with a gentle allium tang that melts seamlessly into the crunch.",
    ingredients: ["Garden Scallions", "Cultured Sour Cream", "Herbs", "Olive Oil"],
    pairing: "Iced peach tea or tender coconut water",
    accentColor: "#4B7258",
    bgGrad: "from-[#4B7258]/15 via-[#4B7258]/5 to-transparent",
  },
  {
    id: "tangy-tomato",
    name: "Tangy Desi Tomato",
    hindiName: "देसी टमाटर",
    tagline: "Sun-ripened country tomatoes with street-side chaat masala punch.",
    spiceLevel: "Medium",
    tasteNotes: "Nostalgic sweet and sour burst with amchur and roasted cumin notes.",
    ingredients: ["Sun-Dried Tomato", "Amchur (Mango Powder)", "Kala Namak", "Olive Oil"],
    pairing: "Afternoon family snacking & road trips",
    accentColor: "#A34828",
    bgGrad: "from-[#A34828]/15 via-[#A34828]/5 to-transparent",
  },
  {
    id: "fresh-pudina",
    name: "Fresh Pudina Masala",
    hindiName: "पुदीना मसाला",
    tagline: "Crisp mountain mint leaves infused with roasted cumin and dry mango.",
    spiceLevel: "Mild",
    tasteNotes: "Refreshing cooling sensation followed by warm earthy Indian digestive spices.",
    ingredients: ["Fresh Garden Mint", "Bhuna Jeera", "Rock Salt", "Olive Oil"],
    pairing: "Post-lunch palate refresher with hot Darjeeling tea",
    accentColor: "#32644B",
    bgGrad: "from-[#32644B]/15 via-[#32644B]/5 to-transparent",
  },
];

export function SignatureFlavours() {
  const [selectedId, setSelectedId] = useState<string>("peri-peri");

  const currentFlavour =
    SIGNATURE_FLAVOURS.find((f) => f.id === selectedId) || SIGNATURE_FLAVOURS[0];

  return (
    <section id="flavours" className="relative bg-[#F7F0E3] py-16 sm:py-24 border-b border-[#E2D7C3] overflow-hidden">
      {/* Background ornamentation */}
      <div className="absolute top-1/2 -right-32 -translate-y-1/2 w-96 h-96 rounded-full border border-[#C49A50]/20 pointer-events-none" />
      <div className="absolute top-1/2 -right-20 -translate-y-1/2 w-72 h-72 rounded-full border border-[#C49A50]/15 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#B85C38] mb-3">
              <Sparkles className="h-3.5 w-3.5 text-[#C49A50]" />
              <span>The 7 Artisanal Creations</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#292820] leading-tight">
              Flavours with a Point of View.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#6E685C] leading-relaxed">
              Every kernel is slow-roasted in pure olive oil, then tossed in gourmet Indian spice compositions designed to elevate everyday snacking.
            </p>
          </div>

          <Link href="/products" className="hidden sm:inline-flex">
            <Button
              variant="outline"
              className="gap-2 rounded-full border-[#C49A50] hover:bg-[#244C38] hover:text-white transition-all text-xs uppercase tracking-wider font-semibold"
            >
              Explore All Flavours <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Flavour Selector Tabs (Horizontal Scrollable on mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none select-none">
          {SIGNATURE_FLAVOURS.map((flavour) => {
            const isSelected = flavour.id === selectedId;
            return (
              <button
                key={flavour.id}
                onClick={() => setSelectedId(flavour.id)}
                className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "bg-[#244C38] text-white shadow-md scale-105"
                    : "bg-white/80 border border-[#E2D7C3] text-[#292820] hover:bg-white hover:border-[#C49A50]"
                }`}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: flavour.accentColor }}
                />
                <span>{flavour.name}</span>
                <span className="text-[10px] opacity-75 hidden sm:inline">({flavour.hindiName})</span>
              </button>
            );
          })}
        </div>

        {/* Active Flavour Spotlight Panel */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFlavour.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="rounded-3xl border border-[#E2D7C3] bg-white p-6 sm:p-10 shadow-[0_12px_40px_-15px_rgba(41,40,32,0.1)] relative overflow-hidden"
            >
              {/* Dynamic Gradient Accents */}
              <div
                className={`absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l ${currentFlavour.bgGrad} pointer-events-none rounded-3xl`}
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
                {/* Left: Detailed Flavour Profile */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span
                      className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-white shadow-xs"
                      style={{ backgroundColor: currentFlavour.accentColor }}
                    >
                      {currentFlavour.spiceLevel} Heat
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#DCE5D7] text-[#244C38] text-[11px] font-semibold">
                      Olive Oil
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#EFE8DA] text-[#6E685C] text-[11px] font-semibold">
                      Zero Trans Fat
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#292820]">
                      {currentFlavour.name}
                    </h3>
                    <p className="text-sm sm:text-base font-medium text-[#B85C38] mt-1">
                      {currentFlavour.tagline}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F7F0E3]/70 border border-[#E2D7C3] space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#292820]">
                      <Sparkles className="h-3.5 w-3.5 text-[#C49A50]" />
                      <span>Tasting Note</span>
                    </div>
                    <p className="text-sm text-[#6E685C] leading-relaxed">
                      {currentFlavour.tasteNotes}
                    </p>
                  </div>

                  {/* Ingredients & Pairings */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#244C38] mb-2 flex items-center gap-1.5">
                        <Flame className="h-3.5 w-3.5" />
                        <span>Key Seasoning</span>
                      </p>
                      <ul className="space-y-1">
                        {currentFlavour.ingredients.map((ing) => (
                          <li key={ing} className="text-xs text-[#292820] flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#C49A50]" />
                            {ing}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#B85C38] mb-2 flex items-center gap-1.5">
                        <Coffee className="h-3.5 w-3.5" />
                        <span>Ideal Pairing</span>
                      </p>
                      <p className="text-xs text-[#6E685C] leading-relaxed">
                        {currentFlavour.pairing}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <Link href={`/products?search=${encodeURIComponent(currentFlavour.name)}`}>
                      <Button
                        size="lg"
                        className="rounded-full bg-[#B85C38] hover:bg-[#9A4928] text-white px-7 text-xs font-semibold gap-2 shadow-sm"
                      >
                        Shop {currentFlavour.name} <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>

                    <Link href="/products">
                      <Button
                        size="lg"
                        variant="outline"
                        className="rounded-full border-[#E2D7C3] text-xs font-semibold text-[#292820]"
                      >
                        View Full Sampler Box
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Right: Visual Emblem & Artisan Crest */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center text-center p-6 sm:p-8 rounded-2xl bg-[#F7F0E3] border border-[#E2D7C3] relative">
                  <div className="relative h-44 w-44 sm:h-52 sm:w-52 transition-transform duration-500 hover:scale-105">
                    <Image
                      src="/Magnora.png"
                      alt={currentFlavour.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  <div className="mt-4 space-y-1">
                    <p className="font-serif text-lg font-bold text-[#292820]">
                      The Maghora Signature
                    </p>
                    <p className="text-xs text-[#6E685C] max-w-xs">
                      Gently roasted in extra virgin olive oil. Tossed fresh in small artisanal batches.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E2D7C3] w-full flex items-center justify-around text-[11px] text-[#244C38] font-semibold">
                    <span>🌱 100% Veg</span>
                    <span>🌾 Gluten Free</span>
                    <span>🫒 Pure Olive Oil</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
