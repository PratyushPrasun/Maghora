import React from "react";
import { HeroBanners } from "@/components/storefront/HeroBanners";
import { WaveTransition } from "@/components/storefront/WaveTransition";
import { FeaturedProducts } from "@/components/storefront/FeaturedProducts";
import { BrandStory } from "@/components/storefront/BrandStory";

export default function HomePage() {
  return (
    <>
      <HeroBanners />
      <WaveTransition />
      <FeaturedProducts />
      <BrandStory />
    </>
  );
}
