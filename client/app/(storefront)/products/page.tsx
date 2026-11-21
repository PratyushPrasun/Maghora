"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { ProductCard } from "@/components/storefront/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MithilaLotus } from "@/components/storefront/MithilaMotifs";

function ProductsCatalogueContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialSort = (searchParams.get("sort") as any) || "newest";
  const initialPage = Number(searchParams.get("page")) || 1;

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sort, setSort] = useState<"newest" | "oldest" | "name_asc" | "name_desc">(initialSort);
  const [page, setPage] = useState(initialPage);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Queries
  const { data: categoriesData } = useCategories();
  const categories = categoriesData || [];

  const { data: productsData, isLoading, error } = useProducts({
    search: search.trim() || undefined,
    category: selectedCategory || undefined,
    sort,
    page,
    limit: 12,
  });

  const products = productsData?.products || [];
  const pagination = productsData?.pagination;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleCategorySelect = (categorySlug: string) => {
    setSelectedCategory((prev) => (prev === categorySlug ? "" : categorySlug));
    setPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSort("newest");
    setPage(1);
  };

  return (
    <div className="py-8 sm:py-14 bg-[#F8EEDC] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEDEC4]/60 border border-[#E8D7BE] text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] text-[#702C32] mb-2 font-serif">
            <MithilaLotus className="h-3 w-3 text-[#E8B84E]" />
            <span>The Maghora Pantry</span>
            <MithilaLotus className="h-3 w-3 text-[#E8B84E]" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#33251F]">
            All Roasted Flavours
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#33251F]/70 max-w-2xl leading-relaxed">
            Slow-roasted exclusively in Olive Oil and seasoned with stone-ground Indian spices.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border-b border-[#E8D7BE]/80 pb-5">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7B685F]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search flavours by name or spice..."
              className="h-11 w-full rounded-2xl border border-[#E8D7BE] bg-white pl-10 pr-10 text-xs sm:text-sm text-[#33251F] placeholder:text-[#7B685F]/60 focus:outline-none focus:ring-2 focus:ring-[#702C32]/30 shadow-xs"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7B685F] hover:text-[#702C32] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>

          {/* Sort & Mobile Filter Toggle */}
          <div className="flex items-center gap-2.5 justify-between md:justify-end">
            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="md:hidden flex items-center gap-2 h-11 px-4 rounded-2xl border border-[#E8D7BE] bg-white text-xs font-semibold text-[#33251F] cursor-pointer"
            >
              <SlidersHorizontal className="h-4 w-4 text-[#702C32]" />
              <span>Categories</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#7B685F] hidden sm:inline">
                Sort:
              </span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as any);
                  setPage(1);
                }}
                className="h-11 rounded-2xl border border-[#E8D7BE] bg-white px-3 text-xs font-medium text-[#33251F] focus:outline-none focus:ring-2 focus:ring-[#702C32]/30 cursor-pointer shadow-xs"
              >
                <option value="newest">Newest Batches</option>
                <option value="oldest">Classic Roasts</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="name_desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills (Desktop) */}
        <div className="hidden md:flex items-center gap-2 flex-wrap mb-7">
          <button
            onClick={() => handleCategorySelect("")}
            className={`h-8 px-4 rounded-full text-xs font-serif font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedCategory === ""
                ? "bg-[#702C32] text-[#F8EEDC] shadow-xs"
                : "border border-[#E8D7BE] bg-white text-[#33251F]/80 hover:bg-[#F8EEDC]"
            }`}
          >
            All Flavours
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategorySelect(cat.slug)}
              className={`h-8 px-4 rounded-full text-xs font-serif font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat.slug
                  ? "bg-[#702C32] text-[#F8EEDC] shadow-xs"
                  : "border border-[#E8D7BE] bg-white text-[#33251F]/80 hover:bg-[#F8EEDC]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Category Pills (Mobile horizontal swipeable strip) */}
        <div className="flex md:hidden items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none -mx-4 px-4">
          <button
            onClick={() => handleCategorySelect("")}
            className={`h-8 shrink-0 px-3.5 rounded-full text-xs font-serif font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedCategory === ""
                ? "bg-[#702C32] text-[#F8EEDC] shadow-xs"
                : "border border-[#E8D7BE] bg-white text-[#33251F]/80 hover:bg-[#F8EEDC]"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategorySelect(cat.slug)}
              className={`h-8 shrink-0 px-3.5 rounded-full text-xs font-serif font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat.slug
                  ? "bg-[#702C32] text-[#F8EEDC] shadow-xs"
                  : "border border-[#E8D7BE] bg-white text-[#33251F]/80 hover:bg-[#F8EEDC]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Mobile Filter Sheet */}
        {showFiltersMobile && (
          <div className="md:hidden mb-5 p-4 rounded-2xl border border-[#E8D7BE] bg-white space-y-2.5">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#702C32] font-serif">
              Select Category
            </h4>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => {
                  handleCategorySelect("");
                  setShowFiltersMobile(false);
                }}
                className={`h-7 px-3 rounded-full text-xs font-medium ${
                  selectedCategory === ""
                    ? "bg-[#702C32] text-[#F8EEDC]"
                    : "border border-[#E8D7BE] bg-[#F8EEDC]"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => {
                    handleCategorySelect(cat.slug);
                    setShowFiltersMobile(false);
                  }}
                  className={`h-7 px-3 rounded-full text-xs font-medium ${
                    selectedCategory === cat.slug
                      ? "bg-[#702C32] text-[#F8EEDC]"
                      : "border border-[#E8D7BE] bg-[#F8EEDC]"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-3xl border border-[#E8D7BE] bg-white p-4 space-y-3 animate-pulse">
                <div className="aspect-square w-full rounded-2xl bg-[#EEDEC4]/60" />
                <div className="h-4 w-3/4 rounded bg-[#EEDEC4]/70" />
                <div className="h-3 w-1/2 rounded bg-[#EEDEC4]/50" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-[#E8D7BE] bg-white p-12 text-center max-w-md mx-auto">
            <p className="text-sm text-[#7B685F]">
              Could not load flavours. Please try again.
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#E8D7BE] bg-white/70 p-12 text-center max-w-md mx-auto">
            <h3 className="text-base font-serif font-bold text-[#33251F]">
              No flavours match your criteria
            </h3>
            <p className="mt-1 text-xs text-[#7B685F]">
              Try adjusting your search terms or filter selection.
            </p>
            <Button
              onClick={resetFilters}
              variant="outline"
              size="sm"
              className="mt-4 rounded-xl text-xs border-[#E8D7BE]"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2 pt-6 border-t border-[#E8D7BE]/70">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-xl gap-1 text-xs border-[#E8D7BE]"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>

            <span className="text-xs font-serif font-bold px-4 text-[#33251F]">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              className="rounded-xl gap-1 text-xs border-[#E8D7BE]"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="container mx-auto px-4 py-16 text-center text-sm text-[#7B685F] animate-pulse">
          Loading Maghora Mithila Pantry...
        </div>
      }
    >
      <ProductsCatalogueContent />
    </React.Suspense>
  );
}
