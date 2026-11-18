"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Heart,
  ShieldCheck,
  Leaf,
  ArrowRight,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { MithilaLotus } from "./MithilaMotifs";

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Thank you for joining the Maghora Heritage Circle!");
    setNewsletterEmail("");
  };

  return (
    <footer className="border-t border-[#C49A50]/30 bg-[#1A3728] text-[#F7F0E3]">
      {/* 1. BRAND VALUES BANNER */}
      <div className="border-b border-white/10 bg-[#244C38] py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-[#C49A50] shrink-0 border border-[#C49A50]/30">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">Pure Olive Oil</h4>
                <p className="text-[11px] sm:text-xs text-[#F7F0E3]/70 mt-0.5">Slow-roasted, never deep-fried</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-[#C49A50] shrink-0 border border-[#C49A50]/30">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">Grade-A Foxnuts</h4>
                <p className="text-[11px] sm:text-xs text-[#F7F0E3]/70 mt-0.5">Direct from Mithila wetlands</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-[#C49A50] shrink-0 border border-[#C49A50]/30">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">Zero Preservatives</h4>
                <p className="text-[11px] sm:text-xs text-[#F7F0E3]/70 mt-0.5">100% natural Indian spices</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-[#C49A50] shrink-0 border border-[#C49A50]/30">
                <Heart className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">Modern Indian Snacking</h4>
                <p className="text-[11px] sm:text-xs text-[#F7F0E3]/70 mt-0.5">Sacred crunch, made for today</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN MULTI-COLUMN FOOTER */}
      <div id="contact" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand Info (Col 1-4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-12 w-12 shrink-0 rounded-full bg-white/90 p-1 border border-[#C49A50]">
                <Image
                  src="/Magnora.png"
                  alt="Maghora Mithila emblem"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold tracking-[0.2em] text-white">
                  MAGHORA
                </span>
                <span className="text-[9px] font-semibold tracking-[0.25em] text-[#C49A50] uppercase">
                  Mithila · Gourmet Makhana
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-[#F7F0E3]/75 leading-relaxed max-w-sm">
              Maghora crafts premium gourmet flavoured makhana (foxnuts), gently roasted in wholesome olive oil and seasoned with authentic, handcrafted spice compositions inspired by Bihar’s culinary heritage.
            </p>

            <div className="pt-1 text-xs text-[#F7F0E3]/65 space-y-1">
              <p className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#C49A50]" />
                Crafted with care in Bihar, India
              </p>
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#C49A50]" />
                FSSAI Certified • 100% Vegetarian • Zero Trans Fat
              </p>
            </div>

            {/* Social Media Links with vector SVGs */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-[#F7F0E3] hover:text-[#C49A50] hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-[#F7F0E3] hover:text-[#C49A50] hover:bg-white/20 transition-colors"
                aria-label="Facebook"
              >
                <svg className="h-4 w-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.592 0 9 1.592 9 4.615V8z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-[#F7F0E3] hover:text-[#C49A50] hover:bg-white/20 transition-colors"
                aria-label="Twitter / X"
              >
                <svg className="h-4 w-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-[#F7F0E3] hover:text-[#C49A50] hover:bg-white/20 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="h-4 w-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Discover Links (Col 5-6) */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-[0.18em] text-[#C49A50]">
              Discover
            </h5>
            <ul className="space-y-2 text-xs sm:text-sm text-[#F7F0E3]/75">
              <li>
                <Link href="/products" className="transition-colors hover:text-[#C49A50]">
                  All 7 Flavours
                </Link>
              </li>
              <li>
                <Link href="/categories" className="transition-colors hover:text-[#C49A50]">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/#flavours" className="transition-colors hover:text-[#C49A50]">
                  Signature Flavour Guide
                </Link>
              </li>
              <li>
                <Link href="/#story" className="transition-colors hover:text-[#C49A50]">
                  Mithila Heritage
                </Link>
              </li>
              <li>
                <Link href="/#why-us" className="transition-colors hover:text-[#C49A50]">
                  Why Olive Oil?
                </Link>
              </li>
              <li>
                <Link href="/#lifestyle" className="transition-colors hover:text-[#C49A50]">
                  Rituals & Pairings
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care (Col 7-8) */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-[0.18em] text-[#C49A50]">
              Customer Care
            </h5>
            <ul className="space-y-2 text-xs sm:text-sm text-[#F7F0E3]/75">
              <li>
                <Link href="/cart" className="transition-colors hover:text-[#C49A50]">
                  Your Basket
                </Link>
              </li>
              <li>
                <Link href="/orders" className="transition-colors hover:text-[#C49A50]">
                  Track Orders
                </Link>
              </li>
              <li>
                <Link href="/account" className="transition-colors hover:text-[#C49A50]">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/#reviews" className="transition-colors hover:text-[#C49A50]">
                  Customer Reviews
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/login"
                  className="text-xs text-[#F7F0E3]/50 transition-colors hover:text-[#C49A50]"
                >
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter (Col 9-12) */}
          <div className="lg:col-span-4 space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-[0.18em] text-[#C49A50]">
              Mithila Dispatch
            </h5>
            <p className="text-xs sm:text-sm text-[#F7F0E3]/75 leading-relaxed">
              Subscribe to receive fresh batch announcements, seasonal flavour releases, and subscriber-exclusive privileges.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="h-10 w-full rounded-xl border border-white/20 bg-white/10 px-3.5 text-xs text-white placeholder:text-[#F7F0E3]/50 focus:outline-none focus:ring-1 focus:ring-[#C49A50]"
                />
                <button
                  type="submit"
                  className="h-10 px-4 bg-[#B85C38] hover:bg-[#9A4928] text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center shrink-0 cursor-pointer shadow-sm"
                  aria-label="Subscribe to newsletter"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <p className="text-[10px] text-[#F7F0E3]/50">
                Zero spam. Only fresh roast dispatches & exclusive offers.
              </p>
            </form>
          </div>
        </div>

        {/* 3. BOTTOM LEGAL BAR */}
        <div className="mt-12 pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F7F0E3]/60 gap-4">
          <p>© {new Date().getFullYear()} Maghora Foods Pvt Ltd. All rights reserved.</p>
          <div className="flex flex-wrap gap-6 text-[11px]">
            <Link href="/#story" className="hover:text-white transition-colors">
              About Us
            </Link>
            <span className="cursor-default hover:text-white transition-colors">
              Privacy Policy
            </span>
            <span className="cursor-default hover:text-white transition-colors">
              Terms of Service
            </span>
            <span className="cursor-default hover:text-white transition-colors">
              Shipping & Returns
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
