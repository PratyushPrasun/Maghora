import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function BrandStory() {
  return (
    <section id="story" className="bg-[#F7F0E3] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-14 lg:gap-20 items-center">
          {/* Visual */}
          <div className="relative aspect-[4/5] md:aspect-[3/4] rounded-2xl overflow-hidden">
            <Image
              src="/Magnora.png"
              alt="Maghora — Rooted in Mithila"
              fill
              className="object-contain bg-[#ECE3D0] p-8 sm:p-12"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>

          {/* Text content */}
          <div className="space-y-5 sm:space-y-6">
            <p className="text-[11px] sm:text-xs font-medium tracking-[0.25em] uppercase text-[#C49A50]">
              Our Heritage
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#292820] tracking-tight leading-tight">
              Rooted in Mithila
            </h2>
            <p className="text-[15px] sm:text-base text-[#292820]/65 leading-relaxed max-w-md">
              Born in the heart of Bihar, Maghora brings you premium makhana
              roasted in pure olive oil — a tradition of purity meeting modern
              culinary craft. Every batch carries the legacy of Mithila&apos;s
              rich heritage.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#B85C38] hover:text-[#9A4928] transition-colors group pt-1"
            >
              Explore Our Story
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
