import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { MithilaLotus } from "@/components/storefront/MithilaMotifs";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Maghora Foods",
  description: "Read about how Maghora collects, protects, and respects your personal data.",
};

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="mt-1 text-xs text-[#7B685F]">
              Last updated: November 2026
            </p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-[#33251F]/80 leading-relaxed font-normal">
            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-[#702C32]">1. Information We Collect</h2>
              <p>
                When you browse our website, create an account, or place an order for our roasted makhana products, we collect essential information required to deliver your orders and manage your account. This includes your name, delivery address, email address, phone number, and payment transaction identifiers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-[#702C32]">2. Payment Processing</h2>
              <p>
                All online transactions on Maghora are processed via certified payment gateways (such as Razorpay). We never store or directly access your credit card numbers, debit card PINs, or UPI credentials on our servers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-[#702C32]">3. Use of Information</h2>
              <p>
                Your information is used solely for order processing, shipping notification updates, customer service communications, and legal compliance. We do not sell or rent your personal data to third parties.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-[#702C32]">4. Contact Us</h2>
              <p>
                If you have questions regarding this Privacy Policy or wish to modify your data, please contact our team at{" "}
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
