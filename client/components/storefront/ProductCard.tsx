"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, Check, ShoppingBag, Eye } from "lucide-react";
import { IProduct } from "@/types/api";
import { formatPrice, formatWeight, calculateDiscount } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: IProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, isAddingItem } = useCart();
  const { isAuthenticated } = useAuth();

  // Find lowest price variant or primary active variant
  const activeVariants = product.variants?.filter((v) => v.isActive !== false) || [];
  const primaryVariant = activeVariants[0] || product.variants?.[0];

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    "/logo.png";

  const pricePaise = primaryVariant?.pricePaise || 0;
  const mrpPaise = primaryVariant?.mrpPaise || 0;
  const discount = calculateDiscount(mrpPaise, pricePaise);
  const isAvailable = primaryVariant ? (primaryVariant.isAvailable ?? true) : false;

  const categoryName =
    typeof product.category === "object" && product.category?.name
      ? product.category.name
      : "Gourmet Makhana";

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!primaryVariant) return;

    await addItem({
      productId: product._id,
      variantId: primaryVariant._id,
      quantity: 1,
    });
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs hover:shadow-lg transition-all"
    >
      {/* Image Container with Badges */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square w-full bg-[#F6F2EA] overflow-hidden"
      >
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
        />

        {/* Status / Discount Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discount > 0 && (
            <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
              {discount}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
              Bestseller
            </span>
          )}
        </div>

        {!isAvailable && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xs flex items-center justify-center z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground border border-border px-3 py-1 rounded-full bg-card">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">
            {categoryName}
          </span>

          <Link href={`/products/${product.slug}`}>
            <h3 className="mt-1 text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
            {product.shortDescription || product.description}
          </p>
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-foreground">
                {formatPrice(pricePaise)}
              </span>
              {mrpPaise > pricePaise && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(mrpPaise)}
                </span>
              )}
            </div>
            {primaryVariant?.weightGrams && (
              <span className="text-[11px] text-muted-foreground">
                {formatWeight(primaryVariant.weightGrams)} pack
              </span>
            )}
          </div>

          <div>
            {isAvailable ? (
              <Button
                size="sm"
                onClick={handleQuickAdd}
                disabled={isAddingItem}
                className="rounded-xl h-9 px-3 gap-1.5"
                aria-label={`Add ${product.name} to cart`}
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Add</span>
              </Button>
            ) : (
              <Link href={`/products/${product.slug}`}>
                <Button size="sm" variant="outline" className="rounded-xl h-9 text-xs">
                  View
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

