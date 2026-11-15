"use client";

import React from "react";
import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";
import { Sparkles, ArrowRight, Layers } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();

  return (
    <div className="py-12 sm:py-20 bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Curated Collections</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif text-foreground">
            Explore by Flavour Profile
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Whether you crave smoky heat, delicate Himalayan salt, or savory cheese herbs, we have a roast created for your palate.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-3xl" />
            ))}
          </div>
        ) : !categories || categories.length === 0 ? (
          <div className="p-16 text-center border border-dashed border-border rounded-3xl bg-card">
            <h3 className="text-lg font-bold text-foreground">Collections Updating</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-6">
              Our curated categories are currently being refreshed.
            </p>
            <Link href="/products">
              <Button>View All Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/products?category=${category.slug}`}
                className="group relative flex flex-col justify-between p-8 rounded-3xl border border-border/80 bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                <div>
                  <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                    <Layers className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold font-serif text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                    {category.description || "Handcrafted roasted makhana infused with distinctive aromatic seasonings."}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-bold text-primary">
                  <span>Explore Collection</span>
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

