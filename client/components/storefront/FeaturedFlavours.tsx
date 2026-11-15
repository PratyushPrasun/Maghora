"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export function FeaturedFlavours() {
  const { data, isLoading, error } = useProducts({ limit: 8, sort: "newest" });
  const products = data?.products || [];

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Signature Collection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-foreground">
              Artisanal Flavours
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              Slow-roasted in pure olive oil and dusted with handcrafted spice blends. Crisp, wholesome, and unapologetically addictive.
            </p>
          </div>

          <Link href="/products" className="hidden sm:inline-flex">
            <Button variant="outline" className="gap-2 rounded-xl">
              View All Flavours <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-border p-4 space-y-4">
                <Skeleton className="aspect-square w-full rounded-xl" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between pt-2">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-8 w-1/4 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error or Empty State */}
        {!isLoading && products.length === 0 && (
          <div className="rounded-3xl border border-dashed border-border bg-muted/30 p-12 text-center">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Flavours are being roasted fresh
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              Our catalogue is currently updating. In the meantime, discover our collections or check back shortly.
            </p>
            <Link href="/products">
              <Button>Browse Collections</Button>
            </Link>
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Mobile View All Button */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/products">
            <Button variant="outline" className="w-full rounded-xl">
              View All Flavours <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

