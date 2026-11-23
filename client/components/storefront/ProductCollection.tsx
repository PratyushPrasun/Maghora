"use client";

import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Check,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import {
  formatPrice,
  formatWeight,
  calculateDiscount,
  getProductPackagingImage,
} from "@/lib/utils";
import { MithilaLotus } from "./MithilaMotifs";
import type { IProduct } from "@/types/api";

interface CompactEditorialCardProps {
  product: IProduct;
  index: number;
  isMobileCarousel?: boolean;
}

function CompactEditorialCard({
  product,
  isMobileCarousel = false,
}: CompactEditorialCardProps) {
  const { addItem, isAddingItem } = useCart();
  const [addedJustNow, setAddedJustNow] = useState(false);
  const [isPendingThis, setIsPendingThis] = useState(false);

  const displayImage = getProductPackagingImage(product);

  const firstVariant =
    product.variants?.find((v) => v.isActive !== false && v.isAvailable !== false) ||
    product.variants?.[0];

  if (!firstVariant) return null;

  const pricePaise = firstVariant.pricePaise || 0;
  const mrpPaise = firstVariant.mrpPaise || 0;
  const discount = calculateDiscount(mrpPaise, pricePaise);
  const isAvailable = firstVariant.isAvailable ?? true;

  const variantLabel =
    firstVariant.weightGrams > 0
      ? `${formatWeight(firstVariant.weightGrams)} Pouch`
      : "Single Pouch";

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!firstVariant || !isAvailable || isPendingThis || isAddingItem) return;

    try {
      setIsPendingThis(true);
      await addItem({
        productId: product._id,
        variantId: firstVariant._id,
        quantity: 1,
      });
      setAddedJustNow(true);
      setTimeout(() => setAddedJustNow(false), 1800);
    } catch {
      // toast is dispatched by useCart hook
    } finally {
      setIsPendingThis(false);
    }
  };

  return (
    <article
      className={`group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border border-[#E8D7BE] bg-[#FCFAF7] hover:bg-white hover:border-[#702C32]/45 transition-all duration-200 shadow-[0_2px_8px_-2px_rgba(51,37,31,0.04)] hover:shadow-[0_10px_24px_-6px_rgba(112,44,50,0.10)] ${
        isMobileCarousel
          ? "w-[215px] min-w-[200px] max-w-[230px] shrink-0 snap-start p-2.5 sm:p-3"
          : "w-full p-2.5 sm:p-3.5"
      }`}
    >
      {/* Editorial Top Accent Line */}
      <div className="absolute top-0 inset-x-3 sm:inset-x-4 h-[1.5px] bg-[#E8D7BE]/70 group-hover:bg-[#702C32]/60 transition-colors duration-200 rounded-full" />

      <div>
        {/* 1. VISUAL PRIORITY #1: Product Packaging Image */}
        <Link
          href={`/products/${product.slug}`}
          className="relative block aspect-square w-full overflow-hidden rounded-lg sm:rounded-xl bg-[#F6EFE3]/85 mb-2 sm:mb-2.5 cursor-pointer border border-[#EFE5D5] group/stage transition-colors duration-200"
          aria-label={`View ${product.name}`}
        >
          {/* Packaging Image (crisp, proportionate, non-oversized) */}
          <Image
            src={displayImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 215px, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-2 sm:p-2.5 transition-transform duration-300 ease-out group-hover:scale-105 select-none"
          />

          {/* Genuine Discount Badge (if applicable) */}
          {discount > 0 && isAvailable && (
            <span className="absolute top-1.5 left-1.5 rounded-md bg-[#C65D35] px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs">
              {discount}% OFF
            </span>
          )}

          {/* Badge: Bestseller wins over Featured when both are set */}
          {product.isBestseller ? (
            <span className="absolute top-1.5 right-1.5 z-10 pointer-events-none rounded bg-[#702C32]/90 px-1.5 py-[3px] text-[8px] font-bold uppercase tracking-wide text-white/90 shadow-xs">
              Bestseller
            </span>
          ) : product.isFeatured ? (
            <span className="absolute top-1.5 right-1.5 z-10 pointer-events-none rounded bg-[#244C38]/90 px-1.5 py-[3px] text-[8px] font-bold uppercase tracking-wide text-white/90 shadow-xs">
              Featured
            </span>
          ) : null}

          {/* Sold Out Overlay */}
          {!isAvailable && (
            <div className="absolute inset-0 bg-[#F8EEDC]/85 backdrop-blur-xs flex items-center justify-center z-10">
              <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-serif font-bold text-[#7B685F] border border-[#E8D7BE] shadow-xs">
                Sold Out
              </span>
            </div>
          )}
        </Link>

        {/* 2. VISUAL PRIORITY #2: Product Name */}
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="font-serif font-bold text-xs sm:text-sm lg:text-[15px] text-[#33251F] group-hover:text-[#702C32] transition-colors line-clamp-1 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* 3. VISUAL PRIORITY #3: Pack Size or Variant */}
        <p className="mt-0.5 text-[11px] text-[#7B685F] font-medium truncate">
          {variantLabel}
        </p>
      </div>

      {/* 4 & 5. VISUAL PRIORITY #4 (Price) & #5 (Add to Cart Action) */}
      <div className="mt-2.5 pt-2 border-t border-[#33251F]/10 flex items-center justify-between gap-1.5">
        <div className="min-w-0">
          <div className="flex items-baseline gap-1">
            <span className="font-serif font-bold text-xs sm:text-sm lg:text-base text-[#33251F]">
              {formatPrice(pricePaise)}
            </span>
            {mrpPaise > pricePaise && (
              <span className="text-[10px] text-[#7B685F] line-through font-normal">
                {formatPrice(mrpPaise)}
              </span>
            )}
          </div>
        </div>

        {/* Action Button: Compact, accessible, tactile */}
        <button
          onClick={handleAddToCart}
          disabled={!isAvailable || isPendingThis || isAddingItem}
          className={`h-7 sm:h-8 px-2.5 sm:px-3 rounded-lg text-[10px] sm:text-[11px] font-serif font-bold uppercase tracking-wider flex items-center gap-1 transition-all duration-150 cursor-pointer shrink-0 ${
            addedJustNow
              ? "bg-[#536B42] text-[#F8EEDC]"
              : isAvailable
              ? "bg-[#702C32] hover:bg-[#551F24] text-[#F8EEDC] active:scale-95 shadow-xs"
              : "bg-[#E8D7BE] text-[#33251F]/40 cursor-not-allowed"
          }`}
          aria-label={`Add ${product.name} to cart`}
        >
          {addedJustNow ? (
            <>
              <Check className="h-3 w-3 stroke-[2.5]" />
              <span>Added</span>
            </>
          ) : isPendingThis ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Adding</span>
            </>
          ) : (
            <>
              <ShoppingBag className="h-3 w-3" />
              <span>Add</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
}

function CompactSkeleton({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <div
      className={`rounded-xl sm:rounded-2xl border border-[#E8D7BE] bg-white/80 p-2.5 sm:p-3 space-y-2.5 animate-pulse ${
        isMobile ? "w-[215px] min-w-[200px] max-w-[230px] shrink-0" : "w-full"
      }`}
    >
      <div className="aspect-square w-full rounded-lg bg-[#EEDEC4]/60" />
      <div className="h-3.5 w-3/4 rounded bg-[#EEDEC4]/70" />
      <div className="h-2.5 w-1/2 rounded bg-[#EEDEC4]/50" />
      <div className="pt-2 border-t border-[#E8D7BE]/50 flex items-center justify-between">
        <div className="h-4 w-12 rounded bg-[#EEDEC4]/70" />
        <div className="h-7 w-14 rounded-lg bg-[#EEDEC4]/80" />
      </div>
    </div>
  );
}

export function ProductCollection() {
  const { data, isLoading, error } = useProducts({ limit: 30, sort: "newest" });
  const allProducts = data?.products || [];

  // Mobile horizontal swipe carousel state & controls
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);

  const handleMobileScroll = useCallback(() => {
    if (!mobileScrollRef.current) return;
    const container = mobileScrollRef.current;
    const firstChild = container.firstElementChild as HTMLElement;
    if (!firstChild) return;
    const cardWidth = firstChild.getBoundingClientRect().width;
    const gap = 12; // 0.75rem gap
    const index = Math.round(container.scrollLeft / (cardWidth + gap));
    setActiveMobileIndex(Math.max(0, Math.min(index, allProducts.length - 1)));
  }, [allProducts.length]);

  const scrollToMobileIndex = (targetIndex: number) => {
    if (!mobileScrollRef.current) return;
    const container = mobileScrollRef.current;
    const firstChild = container.firstElementChild as HTMLElement;
    if (!firstChild) return;
    const cardWidth = firstChild.getBoundingClientRect().width;
    const gap = 12;
    container.scrollTo({
      left: targetIndex * (cardWidth + gap),
      behavior: "smooth",
    });
  };

  const handlePrev = () => {
    scrollToMobileIndex(Math.max(0, activeMobileIndex - 1));
  };

  const handleNext = () => {
    scrollToMobileIndex(Math.min(allProducts.length - 1, activeMobileIndex + 1));
  };

  return (
    <section
      id="products"
      className="scroll-mt-14 relative bg-[#F8EEDC] py-7 sm:py-10 lg:py-12 border-b border-[#E8D7BE]/70 overflow-hidden"
      aria-label="Maghora Product Showcase"
    >
      <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        {/* Section Header: Compact, tight spacing */}
        <div className="text-center max-w-xl mx-auto mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EEDEC4]/70 border border-[#E8D7BE] text-[10px] font-bold uppercase tracking-[0.22em] text-[#702C32] mb-1.5 font-serif">
            <MithilaLotus className="h-3 w-3 text-[#C49A50]" />
            <span>Mithila Artisan Pantry</span>
            <MithilaLotus className="h-3 w-3 text-[#C49A50]" />
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-bold tracking-tight text-[#33251F]">
            The Flavour Collection
          </h2>
          <p className="mt-1 text-xs sm:text-[13px] text-[#33251F]/75 max-w-lg mx-auto leading-relaxed">
            Slow-roasted exclusively in Olive Oil and seasoned with stone-ground Indian spices.
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <>
            {/* Desktop / Tablet Skeleton */}
            <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-4.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <CompactSkeleton key={i} />
              ))}
            </div>

            {/* Mobile Skeleton */}
            <div className="flex sm:hidden overflow-x-auto gap-3 pb-2 -mx-3.5 px-3.5 scrollbar-none">
              {Array.from({ length: 3 }).map((_, i) => (
                <CompactSkeleton key={i} isMobile={true} />
              ))}
            </div>
          </>
        ) : error || allProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E8D7BE] bg-white/70 p-8 text-center max-w-md mx-auto">
            <ShoppingBag className="h-7 w-7 text-[#E8B84E] mx-auto mb-2" />
            <h3 className="font-serif text-sm font-bold text-[#33251F]">
              Fresh Batches Roasting
            </h3>
            <p className="text-xs text-[#33251F]/65 mt-0.5">
              Fresh seasonal batches are currently being prepared. Check back shortly.
            </p>
          </div>
        ) : (
          <div>
            {/* ======================================================== */}
            {/* MOBILE VIEW (< 640px): SWIPEABLE HORIZONTAL CAROUSEL     */}
            {/* ======================================================== */}
            <div className="block sm:hidden">
              {/* Carousel Header Status Strip */}
              <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] font-bold text-[#702C32] bg-[#EEDEC4]/70 px-2 py-0.5 rounded-full border border-[#E8D7BE]">
                    {String(activeMobileIndex + 1).padStart(2, "0")} /{" "}
                    {String(allProducts.length).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] font-medium text-[#7B685F] flex items-center gap-1">
                    Swipe flavours <ArrowRight className="h-2.5 w-2.5 text-[#C65D35]" />
                  </span>
                </div>

                {/* Compact Step Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrev}
                    disabled={activeMobileIndex === 0}
                    className="h-7 w-7 rounded-full border border-[#E8D7BE] bg-white text-[#33251F] hover:bg-[#F8EEDC] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                    aria-label="Previous flavour"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={activeMobileIndex >= allProducts.length - 1}
                    className="h-7 w-7 rounded-full border border-[#E8D7BE] bg-white text-[#33251F] hover:bg-[#F8EEDC] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                    aria-label="Next flavour"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Horizontal Scroll Track: Next card peeks visibly (320px-430px) */}
              <div
                ref={mobileScrollRef}
                onScroll={handleMobileScroll}
                className="flex overflow-x-auto gap-3 pb-2 pt-0.5 snap-x snap-mandatory scrollbar-none -mx-3.5 px-3.5"
                style={{
                  WebkitOverflowScrolling: "touch",
                  scrollSnapType: "x mandatory",
                }}
              >
                {allProducts.map((product, idx) => (
                  <CompactEditorialCard
                    key={product._id}
                    product={product}
                    index={idx}
                    isMobileCarousel={true}
                  />
                ))}
              </div>

              {/* Carousel Pagination Dots */}
              {allProducts.length > 1 && (
                <div className="flex items-center justify-center gap-1.5 pt-2">
                  {allProducts.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => scrollToMobileIndex(idx)}
                      className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                        activeMobileIndex === idx
                          ? "w-5 bg-[#702C32]"
                          : "w-1.5 bg-[#E8D7BE] hover:bg-[#C65D35]/50"
                      }`}
                      aria-label={`Go to flavour ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ======================================================== */}
            {/* TABLET & DESKTOP VIEW (>= 640px): 2, 3 OR 4 COLUMNS     */}
            {/* ======================================================== */}
            <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-4.5">
              {allProducts.map((product, idx) => (
                <CompactEditorialCard
                  key={product._id}
                  product={product}
                  index={idx}
                  isMobileCarousel={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
