"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const shopLinks = [
  { name: "All Products", href: "/products" },
  { name: "Collections", href: "/categories" },
  { name: "Cart", href: "/cart" },
];

const supportLinks = [
  { name: "My Orders", href: "/orders" },
  { name: "My Account", href: "/account" },
  { name: "Contact Us", href: "mailto:support@maghora.com" },
];

export function Footer() {
  return (
    <footer className="bg-[#292820] text-[#F7F0E3]">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-14 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative h-9 w-9 shrink-0">
                <Image
                  src="/Magnora.png"
                  alt="Maghora"
                  fill
                  className="object-contain brightness-0 invert"
                />
              </div>
              <span className="font-serif text-lg font-bold tracking-[0.15em]">
                MAGHORA
              </span>
            </Link>
            <p className="text-sm text-[#F7F0E3]/50 leading-relaxed max-w-xs">
              Premium makhana roasted in pure olive oil. Born in the heart of
              Mithila, Bihar.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-full bg-[#F7F0E3]/10 flex items-center justify-center hover:bg-[#F7F0E3]/20 transition-colors"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-full bg-[#F7F0E3]/10 flex items-center justify-center hover:bg-[#F7F0E3]/20 transition-colors"
                aria-label="Facebook"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-full bg-[#F7F0E3]/10 flex items-center justify-center hover:bg-[#F7F0E3]/20 transition-colors"
                aria-label="X (Twitter)"
              >
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C49A50] mb-5">
              Shop
            </h4>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#F7F0E3]/60 hover:text-[#F7F0E3] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C49A50] mb-5">
              Support
            </h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#F7F0E3]/60 hover:text-[#F7F0E3] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C49A50] mb-5">
              Stay Updated
            </h4>
            <p className="text-sm text-[#F7F0E3]/50 mb-4 leading-relaxed">
              New flavours, heritage stories, and exclusive offers.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="flex"
            >
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 h-10 px-4 text-sm rounded-l-lg bg-[#F7F0E3]/10 border border-[#F7F0E3]/15 text-[#F7F0E3] placeholder:text-[#F7F0E3]/30 focus:outline-none focus:border-[#C49A50]/50 transition-colors"
              />
              <button
                type="submit"
                className="h-10 px-5 text-sm font-medium rounded-r-lg bg-[#B85C38] hover:bg-[#9A4928] text-white transition-colors cursor-pointer"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#F7F0E3]/10">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] sm:text-xs text-[#F7F0E3]/35">
          <p>&copy; {new Date().getFullYear()} Maghora. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="hover:text-[#F7F0E3]/60 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-[#F7F0E3]/60 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/refunds"
              className="hover:text-[#F7F0E3]/60 transition-colors"
            >
              Refunds
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
