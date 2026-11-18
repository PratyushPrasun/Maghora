"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, Star } from "lucide-react";
import { IProduct } from "@/types/api";
import { formatPrice, formatWeight, calculateDiscount } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: IProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, isAddingItem } = useCart();

  // Find lowest price variant or primary active variant
  const activeVariants = product.variants?.filter((v) => v.isActive !== false) || [];
  const primaryVariant = activeVariants[0] || product.variants?.[0];

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    "/Magnora.png";

  const pricePaise = primaryVariant?.pricePaise || 0;
  const mrpPaise = primaryVariant?.mrpPaise || 0;
  const discount = calculateDiscount(mrpPaise, pricePaise);
  const isAvailable = primaryVariant ? (primaryVariant.isAvailable ?? true) : false;

  const categoryName =
    typeof product.category === "object" && product.category?.name
      ? product.category.name
      : "Mithila Makhana";

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
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
      className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-[#E2D7C3] bg-white shadow-[0_6px_20px_-10px_rgba(41,40,32,0.12)] transition-all hover:border-[#C49A50] hover:shadow-[0_16px_36px_-12px_rgba(41,40,32,0.18)]"
    >
      {/* Product Image Stage */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square w-full overflow-hidden bg-[#F7F0E3]/70 p-6"
      >
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges: Discount & Bestseller */}
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10">
          {discount > 0 && (
            <span className="rounded-full bg-[#B85C38] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
              {discount}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="rounded-full bg-[#244C38] px-2.5 py-0.5 text-[10px] font-bold text-[#F7F0E3] shadow-xs">
              Bestseller
            </span>
          )}
        </div>

        {/* Sold out overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6E685C] border border-[#E2D7C3] px-3.5 py-1 rounded-full bg-white">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* Content Body */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#244C38] mb-1">
            <span>{categoryName}</span>
            <div className="flex items-center gap-1 text-[#C49A50]">
              <Star className="h-3 w-3 fill-[#C49A50]" />
              <span className="text-[11px] text-[#292820]">4.9</span>
            </div>
          </div>

          <Link href={`/products/${product.slug}`}>
            <h3 className="font-serif text-base font-bold text-[#292820] line-clamp-1 transition-colors group-hover:text-[#B85C38]">
              {product.name}
            </h3>
          </Link>

          <p className="mt-1 text-xs text-[#6E685C] line-clamp-2 leading-relaxed">
            {product.shortDescription || product.description}
          </p>

          {activeVariants.length > 1 && (
            <p className="mt-2 text-[11px] font-medium text-[#244C38]">
              {activeVariants.length} pack options available
            </p>
          )}
        </div>

        {/* Price & Quick Add Button */}
        <div className="mt-4 flex items-center justify-between border-t border-[#E2D7C3]/60 pt-3.5">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-[#292820]">
                {formatPrice(pricePaise)}
              </span>
              {mrpPaise > pricePaise && (
                <span className="text-xs text-[#6E685C] line-through">
                  {formatPrice(mrpPaise)}
                </span>
              )}
            </div>
            {primaryVariant?.weightGrams && (
              <span className="text-[11px] text-[#6E685C]">
                {formatWeight(primaryVariant.weightGrams)} pouch
              </span>
            )}
          </div>

          <div>
            {isAvailable ? (
              <Button
                size="sm"
                onClick={handleQuickAdd}
                disabled={isAddingItem}
                className="rounded-full h-9 px-3.5 gap-1.5 bg-[#B85C38] hover:bg-[#9A4928] text-white text-xs font-semibold cursor-pointer shadow-xs"
                aria-label={`Add ${product.name} to basket`}
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add</span>
              </Button>
            ) : (
              <Link href={`/products/${product.slug}`}>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full h-9 text-xs border-[#E2D7C3]"
                >
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
