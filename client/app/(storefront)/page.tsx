import React from "react";
import type { Metadata } from "next";
import { HeroBanners } from "@/components/storefront/HeroBanners";
import { BrandStatement } from "@/components/storefront/BrandStatement";
import { ProductCollection } from "@/components/storefront/ProductCollection";
import { AboutMakhana } from "@/components/storefront/AboutMakhana";
import { WhyMaghora } from "@/components/storefront/WhyMaghora";
import { MarketplaceAvailability } from "@/components/storefront/MarketplaceAvailability";
import { HashScrollHandler } from "@/components/storefront/HashScrollHandler";

export const metadata: Metadata = {
  title: "Maghora | Premium Roasted Makhana from Mithila, Bihar",
  description:
    "Discover Maghora: Artisanal flavoured makhana slow-roasted in 100% extra virgin olive oil. Sourced directly from certified wetland farmers in Mithila, Bihar.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <HashScrollHandler />
      {/* SECTION 1: HERO BANNER CAROUSEL */}
      <HeroBanners />

      {/* SECTION 2: BRAND STATEMENT — MAGHORA */}
      <BrandStatement />

      {/* SECTION 3: PRODUCT COLLECTION (ID #products) */}
      <ProductCollection />

      {/* SECTION 4: ABOUT MAKHANA (ID #story) */}
      <AboutMakhana />

      {/* SECTION 5: WHY CHOOSE MAGHORA */}
      <WhyMaghora />

      {/* SECTION 6: AVAILABLE ON */}
      <MarketplaceAvailability />
    </>
  );
}
