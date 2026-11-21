"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Check, Loader2 } from "lucide-react";
import { IProduct } from "@/types/api";
import {
  formatPrice,
  formatWeight,
  calculateDiscount,
  getProductPackagingImage,
} from "@/lib/utils";
import { useCart } from "@/hooks/useCart";

interface ProductCardProps {
  product: IProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, isAddingItem } = useCart();
  const [addedJustNow, setAddedJustNow] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Active or primary variant
  const activeVariants = product.variants?.filter((v) => v.isActive !== false) || [];
  const primaryVariant = activeVariants[0] || product.variants?.[0];

  const displayImage = getProductPackagingImage(product);

  const pricePaise = primaryVariant?.pricePaise || 0;
  const mrpPaise = primaryVariant?.mrpPaise || 0;
  const discount = calculateDiscount(mrpPaise, pricePaise);
  const isAvailable = primaryVariant ? (primaryVariant.isAvailable ?? true) : false;

  const variantLabel =
    primaryVariant?.weightGrams && primaryVariant.weightGrams > 0
      ? `${formatWeight(primaryVariant.weightGrams)} Pouch`
      : activeVariants.length > 1
      ? `${activeVariants.length} Sizes Available`
      : "Single Pouch";

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!primaryVariant || !isAvailable || isPending || isAddingItem) return;

    try {
      setIsPending(true);
      await addItem({
        productId: product._id,
        variantId: primaryVariant._id,
        quantity: 1,
      });
      setAddedJustNow(true);
      setTimeout(() => setAddedJustNow(false), 1800);
    } catch {
      // handled by useCart
    } finally {
      setIsPending(false);
    }
  };

  return (
    <article
      className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border border-[#E8D7BE] bg-[#FCFAF7] hover:bg-white hover:border-[#702C32]/45 transition-all duration-200 shadow-[0_2px_8px_-2px_rgba(51,37,31,0.04)] hover:shadow-[0_10px_24px_-6px_rgba(112,44,50,0.10)] w-full p-2.5 sm:p-3.5"
    >
      {/* Editorial Top Accent Line */}
      <div className="absolute top-0 inset-x-3 sm:inset-x-4 h-[1.5px] bg-[#E8D7BE]/70 group-hover:bg-[#702C32]/60 transition-colors duration-200 rounded-full" />

      <div>
        {/* 1. VISUAL PRIORITY #1: Product Packaging Image */}
        <Link
          href={`/products/${product.slug}`}
          className="relative block aspect-square w-full overflow-hidden rounded-lg sm:rounded-xl bg-[#F6EFE3]/85 mb-2 sm:mb-2.5 cursor-pointer border border-[#EFE5D5] group/stage transition-colors duration-200"
          aria-label={`View details for ${product.name}`}
        >
          {/* Packaging Image (crisp, contained, proportionate) */}
          <Image
            src={displayImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-2 sm:p-2.5 transition-transform duration-300 ease-out group-hover:scale-105 select-none"
          />

          {/* Genuine Discount Badge (if applicable) */}
          {discount > 0 && isAvailable && (
            <span className="absolute top-1.5 left-1.5 rounded-md bg-[#C65D35] px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs">
              {discount}% OFF
            </span>
          )}

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
        {isAvailable ? (
          <button
            onClick={handleQuickAdd}
            disabled={isPending || isAddingItem}
            className={`h-7 sm:h-8 px-2.5 sm:px-3 rounded-lg text-[10px] sm:text-[11px] font-serif font-bold uppercase tracking-wider flex items-center gap-1 transition-all duration-150 cursor-pointer shrink-0 ${
              addedJustNow
                ? "bg-[#536B42] text-[#F8EEDC]"
                : "bg-[#702C32] hover:bg-[#551F24] text-[#F8EEDC] active:scale-95 shadow-xs"
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {addedJustNow ? (
              <>
                <Check className="h-3 w-3 stroke-[2.5]" />
                <span>Added</span>
              </>
            ) : isPending ? (
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
        ) : (
          <Link
            href={`/products/${product.slug}`}
            className="h-7 sm:h-8 px-2.5 sm:px-3 rounded-lg text-[10px] sm:text-[11px] font-serif font-bold uppercase tracking-wider flex items-center border border-[#E8D7BE] text-[#33251F] hover:bg-[#F8EEDC] transition-colors"
          >
            View
          </Link>
        )}
      </div>
    </article>
  );
}
