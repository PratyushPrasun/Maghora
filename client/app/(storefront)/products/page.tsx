"use client";

import React, { useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { ProductCard } from "@/components/storefront/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <div className="py-10 sm:py-16 bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>The Maghora Pantry</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif text-foreground">
            All Roasted Flavours
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Explore our collection of flavoured makhana, roasted in olive oil and finished with handcrafted spice blends.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-border/80 pb-6">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by flavour or spice (e.g. peri peri, truffle)..."
              className="h-11 w-full rounded-2xl border border-border bg-card pl-10 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>

          {/* Sort & Mobile Filter Toggle */}
          <div className="flex items-center gap-3 justify-between md:justify-end">
            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="md:hidden flex items-center gap-2 h-11 px-4 rounded-2xl border border-border bg-card text-sm font-medium text-foreground cursor-pointer"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Categories</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground hidden sm:inline">Sort:</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as any);
                  setPage(1);
                }}
                className="h-11 rounded-2xl border border-border bg-card px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="oldest">Classic Releases</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="name_desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills (Desktop) */}
        <div className="hidden md:flex items-center gap-2 flex-wrap mb-8">
          <button
            onClick={() => handleCategorySelect("")}
            className={`h-9 px-4 rounded-full text-xs font-medium transition-all cursor-pointer ${
              selectedCategory === ""
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "border border-border bg-card text-foreground/80 hover:bg-muted"
            }`}
          >
            All Flavours
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategorySelect(cat.slug)}
              className={`h-9 px-4 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === cat.slug
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "border border-border bg-card text-foreground/80 hover:bg-muted"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Mobile Filter Sheet */}
        {showFiltersMobile && (
          <div className="md:hidden mb-6 p-4 rounded-2xl border border-border bg-card space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Filter by Collection
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  handleCategorySelect("");
                  setShowFiltersMobile(false);
                }}
                className={`h-8 px-3 rounded-full text-xs font-medium ${
                  selectedCategory === ""
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background"
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
                  className={`h-8 px-3 rounded-full text-xs font-medium ${
                    selectedCategory === cat.slug
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-background"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
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
        ) : products.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-muted/20 p-16 text-center">
            <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center text-primary mx-auto mb-4">
              <Search className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No matching flavours found</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
              We couldn&apos;t find any flavours matching your criteria. Try adjusting your search or category filters.
            </p>
            <Button onClick={resetFilters} variant="outline" className="mt-6 rounded-xl">
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-14 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-xl gap-1"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>

            <span className="text-xs font-semibold px-4 text-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              className="rounded-xl gap-1"
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
        <div className="container mx-auto px-4 py-16 text-center text-sm text-muted-foreground animate-pulse">
          Loading Maghora Himalayan Catalogue...
        </div>
      }
    >
      <ProductsCatalogueContent />
    </React.Suspense>
  );
}
