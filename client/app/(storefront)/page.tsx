import React from "react";
import { HeroCampaign } from "@/components/storefront/HeroCampaign";
import { SignatureFlavours } from "@/components/storefront/SignatureFlavours";
import { BestsellersSection } from "@/components/storefront/BestsellersSection";
import { BrandStory } from "@/components/storefront/BrandStory";
import { WhyMaghora } from "@/components/storefront/WhyMaghora";
import { LifestyleStorytelling } from "@/components/storefront/LifestyleStorytelling";
import { CustomerReviews } from "@/components/storefront/CustomerReviews";
import { PromotionalBanner } from "@/components/storefront/PromotionalBanner";
import { FinalCTA } from "@/components/storefront/FinalCTA";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Premium Editorial Hero Campaign */}
      <HeroCampaign />

      {/* 2. Signature Flavour Collection (Interactive 7-flavour showcase) */}
      <SignatureFlavours />

      {/* 3. Bestselling Products (Live catalogue with real pricing & cart actions) */}
      <BestsellersSection />

      {/* 4. Brand Story Inspired by Mithila Heritage */}
      <BrandStory />

      {/* 5. Why Choose Maghora (Matrix comparison & 4 pillars) */}
      <WhyMaghora />

      {/* 6. Lifestyle and Product Storytelling (4 rituals of crunch) */}
      <LifestyleStorytelling />

      {/* 7. Genuine Customer Reviews (Verified community acclaim) */}
      <CustomerReviews />

      {/* 8. Promotional Banner (Heritage Tasting Box privilege) */}
      <PromotionalBanner />

      {/* 9. Final Shopping CTA (Sovereign super-snack invitation) */}
      <FinalCTA />
    </div>
  );
}
