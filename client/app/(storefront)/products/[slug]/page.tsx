"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  ShieldCheck,
  Flame,
  Heart,
  ChevronRight,
  Plus,
  Minus,
  Check,
} from "lucide-react";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice, formatWeight, calculateDiscount } from "@/lib/utils";
import { ProductCard } from "@/components/storefront/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MithilaLotus, MithilaDivider } from "@/components/storefront/MithilaMotifs";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "";
  const router = useRouter();

  const { data: product, isLoading, error } = useProduct(slug);
  const { data: relatedData } = useProducts({ limit: 4 });
  const relatedProducts = relatedData?.products?.filter((p) => p.slug !== slug).slice(0, 4) || [];

  const { addItem, isAddingItem } = useCart();
  const { isAuthenticated } = useAuth();

  const [userSelectedVariantId, setUserSelectedVariantId] = useState<string>("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedJustNow, setAddedJustNow] = useState(false);

  // Derive default active variant
  const defaultVariantId =
    product?.variants?.find((v) => v.isActive !== false)?._id ||
    product?.variants?.[0]?._id ||
    "";
  const selectedVariantId = userSelectedVariantId || defaultVariantId;

  if (isLoading) {
    return (
      <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Skeleton className="aspect-square w-full rounded-3xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-20 text-center max-w-lg mx-auto px-4">
        <div className="h-16 w-16 bg-[#EEDEC4] rounded-full flex items-center justify-center mx-auto mb-4 text-[#702C32]">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold font-serif text-[#33251F]">Flavour Not Found</h2>
        <p className="mt-2 text-xs sm:text-sm text-[#7B685F]">
          The makhana flavour you are looking for is currently unavailable.
        </p>
        <Link href="/products" className="mt-6 inline-block">
          <Button className="bg-[#702C32] hover:bg-[#551F24] text-[#F8EEDC] rounded-xl text-xs font-serif font-bold uppercase tracking-wider">
            Explore All Flavours
          </Button>
        </Link>
      </div>
    );
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [{ url: "/logo.png", alt: product.name, isPrimary: true, sortOrder: 0 }];
  const currentImage = images[selectedImageIndex]?.url || images[0]?.url || "/logo.png";

  const selectedVariant =
    product.variants?.find((v) => v._id === selectedVariantId) ||
    product.variants?.[0];

  const pricePaise = selectedVariant?.pricePaise || 0;
  const mrpPaise = selectedVariant?.mrpPaise || 0;
  const discount = calculateDiscount(mrpPaise, pricePaise);
  const isAvailable = selectedVariant ? (selectedVariant.isAvailable ?? true) : false;

  const handleAddToCart = async () => {
    if (!selectedVariant || !isAvailable) return;
    try {
      await addItem({
        productId: product._id,
        variantId: selectedVariant._id,
        quantity,
        product,
        variant: selectedVariant,
      });
      setAddedJustNow(true);
      setTimeout(() => setAddedJustNow(false), 2000);
    } catch {
      // toast dispatched in hook
    }
  };

  const categoryName =
    typeof product.category === "object" && product.category?.name
      ? product.category.name
      : "Mithila Roasted Makhana";

  return (
    <div className="py-8 sm:py-14 bg-[#F8EEDC] min-h-screen">
      {/* Breadcrumbs */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6">
        <nav className="flex items-center gap-2 text-xs text-[#7B685F]">
          <Link href="/" className="hover:text-[#702C32] transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 opacity-60" />
          <Link href="/products" className="hover:text-[#702C32] transition-colors">
            Flavours
          </Link>
          <ChevronRight className="h-3 w-3 opacity-60" />
          <span className="text-[#33251F] font-bold truncate">{product.name}</span>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left Column: Product Photography Gallery */}
          <div className="lg:col-span-6 space-y-3 sm:space-y-4">
            <div className="relative aspect-square w-full rounded-2xl sm:rounded-3xl bg-white border border-[#E8D7BE] overflow-hidden shadow-[0_8px_30px_rgba(112,44,50,0.06)] flex items-center justify-center p-4 sm:p-6">
              <Image
                src={currentImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-3 sm:p-6 transition-all duration-300"
              />
              {discount > 0 && (
                <span className="absolute top-3 left-3 sm:top-4 sm:left-4 rounded-full bg-[#C65D35] px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-white shadow-xs">
                  {discount}% OFF
                </span>
              )}

              {/* Badge: Bestseller wins over Featured when both are set */}
              {product.isBestseller ? (
                <span className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 pointer-events-none rounded-full bg-[#702C32] px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wide text-[#F8EEDC] shadow-xs">
                  Bestseller
                </span>
              ) : product.isFeatured ? (
                <span className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 pointer-events-none rounded-full bg-[#244C38] px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wide text-[#F8EEDC] shadow-xs">
                  Featured
                </span>
              ) : null}
            </div>

            {/* Thumbnail Carousel */}
            {images.length > 1 && (
              <div className="flex gap-2 sm:gap-2.5 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative h-14 w-14 sm:h-18 sm:w-18 shrink-0 rounded-xl sm:rounded-2xl border-2 overflow-hidden bg-white transition-all cursor-pointer ${
                      selectedImageIndex === idx
                        ? "border-[#702C32] shadow-xs"
                        : "border-[#E8D7BE] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt || product.name}
                      fill
                      className="object-contain p-1 sm:p-1.5"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Editorial Product Purchase Panel */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-2.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEDEC4]/60 border border-[#E8D7BE] text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.24em] text-[#702C32] font-serif">
                  <MithilaLotus className="h-3 w-3 text-[#E8B84E]" />
                  <span>{categoryName}</span>
                </div>
                {product.isBestseller ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#702C32] text-[10px] font-bold uppercase tracking-wide text-[#F8EEDC]">
                    Bestseller
                  </span>
                ) : product.isFeatured ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#244C38] text-[10px] font-bold uppercase tracking-wide text-[#F8EEDC]">
                    Featured
                  </span>
                ) : null}
              </div>
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold font-serif text-[#33251F] leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Pricing Box */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E8D7BE] flex flex-wrap items-baseline justify-between gap-2 sm:gap-3 shadow-2xs">
              <div className="flex items-baseline gap-2 sm:gap-3">
                <span className="text-2xl sm:text-3xl font-serif font-bold text-[#33251F]">
                  {formatPrice(pricePaise)}
                </span>
                {mrpPaise > pricePaise && (
                  <span className="text-xs sm:text-sm text-[#7B685F] line-through font-normal">
                    {formatPrice(mrpPaise)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="rounded-full bg-[#C65D35] px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-white">
                    Save {discount}%
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] text-[#7B685F]">Inclusive of all taxes</span>
            </div>

            {/* Short & Long Description */}
            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-[#33251F]/80 leading-relaxed font-normal">
              {product.shortDescription && (
                <p className="font-medium text-[#33251F]">
                  {product.shortDescription}
                </p>
              )}
              {product.description && (
                <p className="text-[#7B685F]">
                  {product.description}
                </p>
              )}
            </div>

            {/* Pack Size / Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-1.5 sm:space-y-2 pt-1">
                <label className="text-[10px] sm:text-[11px] font-serif font-bold uppercase tracking-wider text-[#33251F] block">
                  Select Pack Size:
                </label>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariantId === v._id;
                    return (
                      <button
                        key={v._id}
                        onClick={() => setUserSelectedVariantId(v._id)}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer min-h-[36px] ${
                          isSelected
                            ? "border-[#702C32] bg-[#702C32] text-[#F8EEDC] shadow-xs"
                            : "border-[#E8D7BE] bg-white text-[#33251F] hover:bg-[#F8EEDC]"
                        }`}
                      >
                        {formatWeight(v.weightGrams)} — {formatPrice(v.pricePaise)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector & Add to Basket */}
            <div className="pt-2.5 sm:pt-3 border-t border-[#E8D7BE]/70 space-y-3">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="flex items-center border border-[#E8D7BE] rounded-xl bg-white shadow-xs h-11 sm:h-12">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-2 sm:p-2.5 text-[#7B685F] hover:text-[#702C32] disabled:opacity-30 cursor-pointer min-w-[36px] flex items-center justify-center"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-2 sm:px-3 text-sm font-bold text-[#33251F] min-w-[32px] text-center font-serif">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                    disabled={quantity >= 20}
                    className="p-2 sm:p-2.5 text-[#7B685F] hover:text-[#702C32] cursor-pointer min-w-[36px] flex items-center justify-center"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!isAvailable || isAddingItem}
                  className={`h-11 sm:h-12 flex-1 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                    addedJustNow
                      ? "bg-[#536B42] text-[#F8EEDC]"
                      : isAvailable
                      ? "bg-[#702C32] hover:bg-[#551F24] text-[#F8EEDC] active:scale-95"
                      : "bg-[#E8D7BE] text-[#7B685F] cursor-not-allowed"
                  }`}
                >
                  {addedJustNow ? (
                    <>
                      <Check className="h-4 w-4 stroke-[2.5]" />
                      <span>Added to Basket</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" />
                      <span>
                        {isAvailable
                          ? `Add to Basket • ${formatPrice(pricePaise * quantity)}`
                          : "Sold Out"}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {!isAvailable && (
                <p className="text-xs text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  This variant is currently out of stock. Please select another pack size or check back soon.
                </p>
              )}
            </div>

            {/* Quality Checkpoints */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 border-t border-[#E8D7BE]/70 pt-4 text-xs text-[#33251F]/80">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/70 border border-[#E8D7BE]/60">
                <ShieldCheck className="h-4 w-4 text-[#702C32] shrink-0" />
                <span className="text-[11px] font-semibold">Olive Oil</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/70 border border-[#E8D7BE]/60">
                <Flame className="h-4 w-4 text-[#C65D35] shrink-0" />
                <span className="text-[11px] font-semibold">Stone-Ground Spices</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/70 border border-[#E8D7BE]/60">
                <Heart className="h-4 w-4 text-[#536B42] shrink-0" />
                <span className="text-[11px] font-semibold">Mithila GI Origin</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-[#E8D7BE]/70">
            <div className="mb-6 text-center sm:text-left">
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#C65D35] font-serif block mb-1">
                From The Pantry
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#33251F]">
                Pair With These Flavours
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
