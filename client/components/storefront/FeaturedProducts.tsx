"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { formatPrice, formatWeight } from "@/lib/utils";
import type { IProduct } from "@/types/api";

function ProductCard({ product, index }: { product: IProduct; index: number }) {
  const { addItem, isAddingItem } = useCart();

  const primaryImage =
    product.images.find((img) => img.isPrimary) || product.images[0];
  const firstVariant =
    product.variants.find(
      (v) => v.isActive !== false && v.isAvailable !== false
    ) || product.variants[0];

  if (!firstVariant) return null;

  const hasDiscount = firstVariant.mrpPaise > firstVariant.pricePaise;

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addItem({
      productId: product._id,
      variantId: firstVariant._id,
      quantity: 1,
      product,
      variant: firstVariant,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
    >
      <Link href={`/products/${product.slug}`} className="group block">
        {/* Image */}
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#F7F0E3] mb-4">
          {primaryImage && (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          )}

          {/* Quick-add button — appears on hover */}
          <button
            onClick={handleAdd}
            disabled={isAddingItem}
            className="absolute bottom-3 right-3 h-10 w-10 rounded-full bg-[#244C38] text-white flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#1A3728] disabled:opacity-50 cursor-pointer shadow-lg"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="h-4 w-4" />
          </button>

          {/* Discount badge */}
          {hasDiscount && (
            <span className="absolute top-3 left-3 bg-[#B85C38] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
              Save{" "}
              {Math.round(
                ((firstVariant.mrpPaise - firstVariant.pricePaise) /
                  firstVariant.mrpPaise) *
                  100
              )}
              %
            </span>
          )}

          {/* Badge: Bestseller wins over Featured when both are set */}
          {product.isBestseller ? (
            <span className="absolute top-3 right-3 z-10 pointer-events-none rounded-full bg-[#702C32]/90 border border-white/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white/90 shadow-sm">
              Bestseller
            </span>
          ) : product.isFeatured ? (
            <span className="absolute top-3 right-3 z-10 pointer-events-none rounded-full bg-[#1A3728]/90 border border-white/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white/90 shadow-sm">
              Featured
            </span>
          ) : null}
        </div>

        {/* Info */}
        <div className="space-y-1.5 px-0.5">
          <h3 className="font-serif text-base sm:text-lg font-semibold text-[#F7F0E3] group-hover:text-[#C49A50] transition-colors leading-snug">
            {product.name}
          </h3>

          {product.shortDescription && (
            <p className="text-[13px] text-[#F7F0E3]/50 leading-relaxed line-clamp-2">
              {product.shortDescription}
            </p>
          )}

          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-base font-semibold text-[#F7F0E3]">
              {formatPrice(firstVariant.pricePaise)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-[#F7F0E3]/35 line-through">
                {formatPrice(firstVariant.mrpPaise)}
              </span>
            )}
            {firstVariant.weightGrams > 0 && (
              <span className="text-xs text-[#F7F0E3]/35">
                · {formatWeight(firstVariant.weightGrams)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] rounded-2xl bg-[#F7F0E3]/10 mb-4" />
      <div className="space-y-2 px-0.5">
        <div className="h-5 bg-[#F7F0E3]/10 rounded w-3/4" />
        <div className="h-3.5 bg-[#F7F0E3]/8 rounded w-full" />
        <div className="h-4 bg-[#F7F0E3]/10 rounded w-1/3 mt-1" />
      </div>
    </div>
  );
}

export function FeaturedProducts() {
  const { data, isLoading, error } = useProducts({ limit: 12, sort: "newest" });
  const allProducts = data?.products || [];
  const featuredOnly = allProducts.filter((p) => p.isFeatured);
  const products = (featuredOnly.length > 0 ? featuredOnly : allProducts).slice(0, 3);

  return (
    <section id="featured-products" className="bg-[#244C38] py-16 sm:py-20 lg:py-24 scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-[11px] sm:text-xs font-medium tracking-[0.25em] uppercase text-[#C49A50] mb-3">
            Curated Selection
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#F7F0E3] tracking-tight">
            Our Finest Picks
          </h2>
        </div>

        {/* Product grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error || products.length === 0 ? (
          <div className="text-center py-12 text-[#F7F0E3]/50 text-sm">
            Products coming soon.
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {products.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        )}

        {/* View all link */}
        {products.length > 0 && (
          <div className="text-center mt-10 sm:mt-14">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#C49A50] hover:text-[#DDB876] transition-colors group"
            >
              View All Products
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
