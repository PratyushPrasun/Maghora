"use client";

import React from "react";
import Image from "next/image";
import { useProduct } from "@/hooks/useProducts";

interface ProductThumbnailProps {
  slug: string | null;
  name: string;
  className?: string;
}

export function ProductThumbnail({ slug, name, className = "" }: ProductThumbnailProps) {
  const { data } = useProduct(slug || "");
  const image = data?.images?.find((item) => item.isPrimary)?.url || data?.images?.[0]?.url;

  return (
    <div className={`relative shrink-0 overflow-hidden rounded-2xl border border-border/70 bg-[#efe5d5] ${className}`}>
      {image ? (
        <Image src={image} alt={name} fill sizes="80px" className="object-contain p-2" />
      ) : (
        <div aria-label={`${name} image loading`} className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif text-xl font-semibold text-primary/70">M</span>
        </div>
      )}
    </div>
  );
}
