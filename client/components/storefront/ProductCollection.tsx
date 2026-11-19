"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, Check } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { formatPrice, formatWeight } from "@/lib/utils";
import type { IProduct } from "@/types/api";

interface ProductCardProps {
  product: IProduct;
  index: number;
}

function CleanProductCard({ product, index }: ProductCardProps) {
  const { addItem, isAddingItem } = useCart();
  const [addedJustNow, setAddedJustNow] = useState(false);

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    "/Magnora.png";

  const firstVariant =
    product.variants?.find(
      (v) => v.isActive !== false && v.isAvailable !== false
    ) || product.variants?.[0];

  if (!firstVariant) return null;

  const pricePaise = firstVariant.pricePaise || 0;
  const mrpPaise = firstVariant.mrpPaise || 0;
  const hasDiscount = mrpPaise > pricePaise;
  const isAvailable = firstVariant.isAvailable ?? true;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!firstVariant || !isAvailable) return;

    try {
      await addItem({
        productId: product._id,
        variantId: firstVariant._id,
        quantity: 1,
      });
      setAddedJustNow(true);
      setTimeout(() => setAddedJustNow(false), 1800);
    } catch {
      // toast is dispatched by useCart
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.08, 0.4) }}
      className="group relative flex flex-col justify-between rounded-2xl border border-[#E2D7C3] bg-white p-4 sm:p-5 transition-all duration-300 hover:border-[#C49A50]/80 hover:shadow-[0_12px_28px_-10px_rgba(41,40,32,0.12)]"
    >
      <div>
        {/* Product Image Stage */}
        <Link
          href={`/products/${product.slug}`}
          className="relative block aspect-[4/5] w-full overflow-hidden rounded-xl bg-[#F7F0E3]/70 mb-4 cursor-pointer"
        >
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-4 sm:p-6 transition-transform duration-500 group-hover:scale-105"
          />

          {/* Simple discount indicator if applicable */}
          {hasDiscount && (
            <span className="absolute top-3 left-3 rounded-md bg-[#B85C38] px-2 py-0.5 text-[10px] font-bold text-white tracking-wider">
              SAVE {Math.round(((mrpPaise - pricePaise) / mrpPaise) * 100)}%
            </span>
          )}

          {!isAvailable && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center">
              <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[#6E685C] border border-[#E2D7C3]">
                Sold Out
              </span>
            </div>
          )}
        </Link>

        {/* Product Information */}
        <div className="space-y-1.5">
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-serif text-base sm:text-lg font-bold text-[#292820] transition-colors group-hover:text-[#B85C38] line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {product.shortDescription && (
            <p className="text-xs text-[#292820]/65 line-clamp-2 leading-relaxed">
              {product.shortDescription}
            </p>
          )}
        </div>
      </div>

      {/* Pricing & Shopping Action */}
      <div className="mt-4 pt-3.5 border-t border-[#E2D7C3]/60 flex items-center justify-between gap-2">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-bold text-[#292820]">
              {formatPrice(pricePaise)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-[#292820]/40 line-through">
                {formatPrice(mrpPaise)}
              </span>
            )}
          </div>
          {firstVariant.weightGrams > 0 && (
            <span className="text-[11px] text-[#292820]/50 block">
              {formatWeight(firstVariant.weightGrams)} pouch
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!isAvailable || isAddingItem}
          className={`h-9 px-3.5 sm:px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
            addedJustNow
              ? "bg-[#244C38] text-white"
              : isAvailable
              ? "bg-[#244C38] hover:bg-[#1A3728] text-white active:scale-95 shadow-xs"
              : "bg-[#E2D7C3] text-[#292820]/40 cursor-not-allowed"
          }`}
          aria-label={`Add ${product.name} to cart`}
        >
          {addedJustNow ? (
            <>
              <Check className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Add</span>
            </>
          )}
        </button>
      </div>
    </motion.article>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[#E2D7C3] bg-white p-4 sm:p-5 space-y-4 animate-pulse">
      <div className="aspect-[4/5] w-full rounded-xl bg-[#ECE3D0]/60" />
      <div className="space-y-2">
        <div className="h-5 w-3/4 rounded bg-[#ECE3D0]/70" />
        <div className="h-3.5 w-full rounded bg-[#ECE3D0]/50" />
      </div>
      <div className="pt-3 border-t border-[#E2D7C3]/60 flex items-center justify-between">
        <div className="h-5 w-1/3 rounded bg-[#ECE3D0]/70" />
        <div className="h-9 w-20 rounded-xl bg-[#ECE3D0]/80" />
      </div>
    </div>
  );
}

export function ProductCollection() {
  const { data, isLoading, error } = useProducts({ limit: 40, sort: "newest" });
  const allProducts = data?.products || [];

  // Split into first 3 products and remaining products
  const firstThreeProducts = allProducts.slice(0, 3);
  const remainingProducts = allProducts.slice(3);

  return (
    <section
      id="products"
      className="scroll-mt-20 bg-[#F7F0E3] py-14 sm:py-20 border-t border-[#E2D7C3]"
      aria-label="Maghora Product Collection"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#C49A50] mb-2">
            The Pantry Collection
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#292820]">
            Roasted Makhana Flavours
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm text-[#292820]/70 leading-relaxed">
            Slow-roasted in pure extra virgin olive oil and seasoned with artisanal Indian spices. 100% vegetarian, gluten-free, and naturally nutritious.
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : error || allProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E2D7C3] bg-white/60 p-12 text-center max-w-md mx-auto">
            <ShoppingBag className="h-8 w-8 text-[#C49A50] mx-auto mb-3" />
            <h3 className="font-serif text-base font-bold text-[#292820]">
              Flavours Coming Soon
            </h3>
            <p className="text-xs text-[#292820]/60 mt-1">
              Fresh seasonal batches are currently being prepared. Check back shortly.
            </p>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {/* Part A: The first three primary products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {firstThreeProducts.map((product, idx) => (
                <CleanProductCard
                  key={product._id}
                  product={product}
                  index={idx}
                />
              ))}
            </div>

            {/* Part B: All remaining products immediately following the first three */}
            {remainingProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-2">
                {remainingProducts.map((product, idx) => (
                  <CleanProductCard
                    key={product._id}
                    product={product}
                    index={idx + 3}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
