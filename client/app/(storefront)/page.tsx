import React from "react";
import { HeroSection } from "@/components/storefront/HeroSection";
import { FeaturedFlavours } from "@/components/storefront/FeaturedFlavours";
import { BrandStory } from "@/components/storefront/BrandStory";
import { BenefitsSection } from "@/components/storefront/BenefitsSection";
import { Testimonials } from "@/components/storefront/Testimonials";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturedFlavours />
      <BrandStory />
      <BenefitsSection />
      <Testimonials />
    </div>
  );
}

