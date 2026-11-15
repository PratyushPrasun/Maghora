"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  Flame,
  Heart,
  ChevronRight,
  Plus,
  Minus,
  Check,
  Star,
  Share2,
} from "lucide-react";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice, formatWeight, calculateDiscount } from "@/lib/utils";
import { ProductCard } from "@/components/storefront/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

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

  // Derive default active variant cleanly without cascading effect
  const defaultVariantId = product?.variants?.find((v) => v.isActive !== false)?._id || product?.variants?.[0]?._id || "";
  const selectedVariantId = userSelectedVariantId || defaultVariantId;

  if (isLoading) {
    return (
      <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-square w-full rounded-3xl" />
          <div className="space-y-6">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-24 text-center max-w-lg mx-auto px-4">
        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold font-serif text-foreground">Flavour Not Found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The makhana flavour you are looking for is either unavailable or has been discontinued.
        </p>
        <Link href="/products" className="mt-6 inline-block">
          <Button>Browse All Flavours</Button>
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [{ url: "/logo.png", alt: product.name, isPrimary: true, sortOrder: 0 }];
  const currentImage = images[selectedImageIndex]?.url || images[0]?.url || "/logo.png";

  const selectedVariant =
    product.variants?.find((v) => v._id === selectedVariantId) ||
    product.variants?.[0];

  const pricePaise = selectedVariant?.pricePaise || 0;
  const mrpPaise = selectedVariant?.mrpPaise || 0;
  const discount = calculateDiscount(mrpPaise, pricePaise);
  const isAvailable = selectedVariant ? (selectedVariant.isAvailable ?? true) : false;

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    await addItem({
      productId: product._id,
      variantId: selectedVariant._id,
      quantity,
    });
  };

  const categoryName =
    typeof product.category === "object" && product.category?.name
      ? product.category.name
      : "Signature Flavours";

  return (
    <div className="py-10 sm:py-16 bg-background">
      {/* Breadcrumbs */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/products" className="hover:text-foreground">
            Flavours
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium truncate">{product.name}</span>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-3xl bg-secondary/30 border border-border/80 overflow-hidden shadow-sm flex items-center justify-center p-8">
              <Image
                src={currentImage}
                alt={product.name}
                fill
                priority
                className="object-contain p-6 transition-all duration-300"
              />
              {discount > 0 && (
                <span className="absolute top-5 left-5 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white shadow-xs">
                  {discount}% SAVINGS
                </span>
              )}
            </div>

            {/* Thumbnail Carousel */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative h-20 w-20 flex-shrink-0 rounded-2xl border-2 overflow-hidden bg-card transition-all cursor-pointer ${
                      selectedImageIndex === idx ? "border-primary shadow-xs" : "border-border/60 opacity-70"
                    }`}
                  >
                    <Image src={img.url} alt={img.alt || product.name} fill className="object-contain p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Purchase Panel */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent mb-2">
                <Sparkles className="h-3 w-3" />
                <span>{categoryName}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold font-serif text-foreground">
                {product.name}
              </h1>

              {/* Review badge */}
              <div className="mt-3 flex items-center gap-3">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-foreground">4.9 / 5</span>
                <span className="text-xs text-muted-foreground">• 128 Verified Ratings</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="p-4 rounded-2xl bg-secondary/20 border border-border/60 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">
                {formatPrice(pricePaise)}
              </span>
              {mrpPaise > pricePaise && (
                <span className="text-base text-muted-foreground line-through">
                  {formatPrice(mrpPaise)}
                </span>
              )}
              {discount > 0 && (
                <Badge variant="accent">Save {discount}%</Badge>
              )}
              <span className="text-xs text-muted-foreground ml-auto">Inclusive of all taxes</span>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description || product.shortDescription}
            </p>

            {/* Pack Size / Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Select Pack Size:
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariantId === v._id;
                    return (
                      <button
                        key={v._id}
                        onClick={() => setUserSelectedVariantId(v._id)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground shadow-xs"
                            : "border-border bg-card text-foreground hover:bg-muted"
                        }`}
                      >
                        {formatWeight(v.weightGrams)} ({formatPrice(v.pricePaise)})
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector & Add to Basket */}
            <div className="pt-4 border-t border-border/80 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-xl bg-card">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-3 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 text-sm font-bold text-foreground min-w-[36px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                    disabled={quantity >= 20}
                    className="p-3 text-muted-foreground hover:text-foreground cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!isAvailable || isAddingItem}
                  className="flex-1 rounded-xl gap-2 font-bold shadow-md h-12"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {isAvailable ? `Add to Basket • ${formatPrice(pricePaise * quantity)}` : "Out of Stock"}
                </Button>
              </div>

              {!isAvailable && (
                <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  This variant is currently out of stock. Please select another pack size or check back soon.
                </p>
              )}
            </div>

            {/* Quality Checkpoints */}
            <div className="pt-6 border-t border-border/80 grid grid-cols-2 gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Slow Roasted in Olive Oil</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-accent" />
                <span>Rich in Protein & Fiber</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                <span>Zero Cholesterol & Palm Oil</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>100% Vegetarian & Gluten Free</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-border/80">
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-accent">
                You Might Also Love
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-bold font-serif text-foreground">
                Pair With These Flavours
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
