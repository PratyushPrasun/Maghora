"use client";

import React from "react";
import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";
import { ArrowRight, Layers } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MithilaLotus } from "@/components/storefront/MithilaMotifs";

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();

  return (
    <div className="py-8 sm:py-14 bg-[#F8EEDC] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEDEC4]/60 border border-[#E8D7BE] text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] text-[#702C32] mb-2 font-serif">
            <MithilaLotus className="h-3 w-3 text-[#E8B84E]" />
            <span>Curated Collections</span>
            <MithilaLotus className="h-3 w-3 text-[#E8B84E]" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#33251F]">
            Explore by Flavour Profile
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#33251F]/70 leading-relaxed">
            Slow-roasted in pure olive oil and seasoned with distinctive spice blends.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-44 w-full rounded-3xl bg-white" />
            ))}
          </div>
        ) : !categories || categories.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-[#E8D7BE] rounded-3xl bg-white max-w-md mx-auto">
            <h3 className="text-base font-bold font-serif text-[#33251F]">Collections Updating</h3>
            <p className="text-xs text-[#7B685F] mt-1 mb-5">
              Our curated categories are currently being refreshed.
            </p>
            <Link href="/products">
              <Button className="bg-[#702C32] hover:bg-[#551F24] text-[#F8EEDC] text-xs font-serif uppercase tracking-wider">
                View All Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/products?category=${category.slug}`}
                className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl border border-[#E8D7BE] bg-white hover:border-[#702C32] hover:shadow-md transition-all duration-300"
              >
                <div>
                  <div className="h-11 w-11 rounded-2xl bg-[#F8EEDC] flex items-center justify-center text-[#702C32] mb-5 group-hover:scale-105 transition-transform border border-[#E8D7BE]">
                    <Layers className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold font-serif text-[#33251F] group-hover:text-[#702C32] transition-colors">
                    {category.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-[#7B685F] line-clamp-3 leading-relaxed font-normal">
                    {category.description || "Handcrafted roasted makhana infused with distinctive aromatic seasonings."}
                  </p>
                </div>

                <div className="mt-6 pt-3.5 border-t border-[#E8D7BE]/60 flex items-center justify-between text-xs font-serif font-bold uppercase tracking-wider text-[#702C32]">
                  <span>Explore Collection</span>
                  <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
