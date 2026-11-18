"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MithilaLotus } from "./MithilaMotifs";

export function BestsellersSection() {
  // Query featured products first, or latest active catalogue
  const { data, isLoading } = useProducts({ limit: 4, sort: "newest" });
  const products = data?.products || [];

  return (
    <section className="bg-white py-16 sm:py-24 border-b border-[#E2D7C3] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#244C38] mb-2.5">
              <MithilaLotus className="h-3.5 w-3.5 text-[#C49A50]" />
              <span>Customer Acclaim</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-[#292820]">
              Bestselling Harvests
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-[#6E685C] max-w-xl leading-relaxed">
              Our most celebrated roasted foxnut packs, prepared in small batches and loved across Indian homes.
            </p>
          </div>

          <Link href="/products" className="hidden sm:inline-flex">
            <Button
              variant="outline"
              className="gap-2 rounded-full border-[#C49A50] hover:bg-[#B85C38] hover:text-white hover:border-[#B85C38] transition-all text-xs font-semibold uppercase tracking-wider"
            >
              View Full Pantry <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-3xl border border-[#E2D7C3] p-5 space-y-4 bg-[#F7F0E3]/40">
                <Skeleton className="aspect-square w-full rounded-2xl bg-[#EFE8DA]" />
                <Skeleton className="h-3 w-1/3 bg-[#EFE8DA]" />
                <Skeleton className="h-5 w-3/4 bg-[#EFE8DA]" />
                <Skeleton className="h-4 w-full bg-[#EFE8DA]" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-6 w-1/3 bg-[#EFE8DA]" />
                  <Skeleton className="h-9 w-1/4 rounded-full bg-[#EFE8DA]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty Catalog State */}
        {!isLoading && products.length === 0 && (
          <div className="rounded-3xl border border-dashed border-[#E2D7C3] bg-[#F7F0E3]/60 p-12 text-center">
            <MithilaLotus className="h-10 w-10 text-[#C49A50] mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-[#292820] mb-1">
              Fresh Harvest Roasting in Progress
            </h3>
            <p className="text-sm text-[#6E685C] max-w-md mx-auto mb-6">
              Our artisanal makhana batches are freshly prepared every week. Explore all active collections in our shop.
            </p>
            <Link href="/products">
              <Button className="rounded-full bg-[#B85C38] text-white">
                Browse Shop
              </Button>
            </Link>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Mobile View All Button */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/products">
            <Button
              variant="outline"
              className="w-full rounded-full border-[#C49A50] text-[#292820] font-semibold text-xs uppercase tracking-wider"
            >
              View Full Pantry <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
