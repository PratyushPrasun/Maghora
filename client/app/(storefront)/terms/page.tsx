import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { MithilaLotus } from "@/components/storefront/MithilaMotifs";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | Maghora Foods",
  description: "Read the terms and conditions for ordering and shopping on Maghora.",
};

export default function TermsPage() {
  return (
    <div className="bg-[#F8EEDC] text-[#33251F] min-h-screen py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-serif font-bold uppercase tracking-[0.18em] text-[#702C32] hover:underline mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Return to Home
        </Link>

        <div className="rounded-3xl border border-[#E8D7BE] bg-white p-8 sm:p-12 shadow-[0_8px_30px_rgba(112,44,50,0.04)] space-y-6">
          <div className="border-b border-[#E8D7BE]/70 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEDEC4]/60 border border-[#E8D7BE] text-[10px] font-bold uppercase tracking-[0.22em] text-[#702C32] mb-2 font-serif">
              <MithilaLotus className="h-3 w-3 text-[#E8B84E]" />
              <span>Maghora Legal</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#33251F]">
              Terms of Service
            </h1>
            <p className="mt-1 text-xs text-[#7B685F]">
              Last updated: November 2026
            </p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-[#33251F]/80 leading-relaxed font-normal">
            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-[#702C32]">1. Introduction & Acceptance</h2>
              <p>
                By accessing and placing orders through the Maghora website, you agree to comply with and be bound by these terms. Maghora is dedicated to delivering premium flavoured makhana roasted in 100% extra virgin olive oil.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-[#702C32]">2. Orders & Pricing</h2>
              <p>
                All prices listed on the storefront are in Indian Rupees (₹) and are inclusive of applicable taxes unless specified otherwise. We reserve the right to correct any inadvertent pricing errors and cancel orders placed under incorrect pricing.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-[#702C32]">3. Shipping & Delivery</h2>
              <p>
                Orders are processed within 24 to 48 hours and dispatched via verified logistics partners. Standard delivery timelines range from 3 to 6 business days across India. Free shipping applies on eligible qualifying order subtotals.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-[#702C32]">4. Returns & Quality Assurance</h2>
              <p>
                Due to the perishable nature of gourmet food items, returns are accepted exclusively for damaged shipments, defective seals, or incorrectly dispatched items reported within 48 hours of delivery at{" "}
                <a href="mailto:maghora0408@gmail.com" className="text-[#702C32] font-semibold underline">
                  maghora0408@gmail.com
                </a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
