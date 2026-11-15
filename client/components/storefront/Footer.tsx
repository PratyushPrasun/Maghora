"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Heart, ShieldCheck, Leaf, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function Footer() {
  return (
    <footer className="border-t border-border bg-[#F5F1E8] text-foreground">
      {/* Brand Values Banner */}
      <div className="border-b border-border/60 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">Pure Olive Oil</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Slow roasted, never deep fried</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">Grade-A Foxnuts</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Jumbo size, crunchy perfection</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">Zero Preservatives</h4>
                <p className="text-xs text-muted-foreground mt-0.5">100% natural Indian spices</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Heart className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">Guilt-Free Snacking</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Rich in protein & antioxidants</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="relative h-12 w-40">
              <Image
                src="/Magnora.png"
                alt="Maghora Logo"
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Maghora crafts premium gourmet flavoured makhana (foxnuts), gently roasted in wholesome olive oil and seasoned with authentic, handcrafted spice blends.
            </p>
            <div className="pt-2 text-xs text-muted-foreground">
              <p>📍 Crafted with care in India</p>
              <p>🌱 FSSAI Certified • 100% Vegetarian</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-primary">Discover</h5>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li>
                <Link href="/products" className="hover:text-accent transition-colors">
                  All Flavours
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-accent transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/#story" className="hover:text-accent transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/#benefits" className="hover:text-accent transition-colors">
                  Health Benefits
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-primary">Customer Care</h5>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li>
                <Link href="/cart" className="hover:text-accent transition-colors">
                  Your Basket
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-accent transition-colors">
                  Order History
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-accent transition-colors">
                  My Profile
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-accent transition-colors text-xs text-muted-foreground">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-primary">Stay In The Loop</h5>
            <p className="text-xs text-muted-foreground">
              Subscribe for new artisanal flavour drops and exclusive member-only offers.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Thank you for subscribing to Maghora flavour drops!");
              }}
              className="flex gap-2"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="h-10 w-full rounded-xl border border-border bg-card px-3 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                className="h-10 px-3.5 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:bg-primary-hover transition-colors flex items-center justify-center flex-shrink-0 cursor-pointer"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} Maghora Foods Pvt Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Shipping Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
