"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Mail, MapPin } from "lucide-react";
import { MithilaLotus, MithilaBorderRibbon } from "./MithilaMotifs";

export function Footer() {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavClick = (e: React.MouseEvent, targetHash: string) => {
    if (pathname === "/") {
      e.preventDefault();
      const id = targetHash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        const headerOffset = 80;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        window.history.pushState(null, "", `#${id}`);
      }
    } else {
      router.push(`/${targetHash}`);
    }
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "/");
    }
  };

  return (
    <footer className="relative bg-[#292820] text-[#F7F0E3] border-t border-[#C49A50]/30 overflow-hidden">
      {/* Subtle Mithila top border ribbon */}
      <div className="opacity-40">
        <MithilaBorderRibbon className="w-full h-2.5" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14">
          {/* Brand & Identity Column */}
          <div className="md:col-span-5 space-y-4">
            <Link
              href="/"
              onClick={handleHomeClick}
              className="inline-flex items-center gap-3 group"
            >
              <div className="relative h-10 w-10 shrink-0">
                <Image
                  src="/Magnora.png"
                  alt="Maghora"
                  fill
                  className="object-contain brightness-0 invert"
                />
              </div>
              <span className="font-serif text-xl font-extrabold tracking-[0.18em] text-[#F7F0E3] transition-colors group-hover:text-[#C49A50]">
                MAGHORA
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-[#F7F0E3]/70 leading-relaxed max-w-sm">
              Artisanal makhana gently roasted in 100% extra virgin olive oil and seasoned with real Indian spices. Rooted in the ancient wetland heritage of Mithila, Bihar.
            </p>

            {/* Cultural Origin Note */}
            <div className="flex items-center gap-2 text-xs text-[#C49A50] pt-1">
              <MithilaLotus className="h-4 w-4 text-[#C49A50]" />
              <span className="tracking-wider uppercase text-[11px] font-semibold">
                Protected GI Origin · Bihar, India
              </span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-serif text-xs font-bold uppercase tracking-[0.22em] text-[#C49A50]">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link
                  href="/"
                  onClick={handleHomeClick}
                  className="text-[#F7F0E3]/70 hover:text-[#F7F0E3] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/#products"
                  onClick={(e) => handleNavClick(e, "#products")}
                  className="text-[#F7F0E3]/70 hover:text-[#F7F0E3] transition-colors cursor-pointer"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/#story"
                  onClick={(e) => handleNavClick(e, "#story")}
                  className="text-[#F7F0E3]/70 hover:text-[#F7F0E3] transition-colors cursor-pointer"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[#F7F0E3]/70 hover:text-[#F7F0E3] transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support & Provenance */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-serif text-xs font-bold uppercase tracking-[0.22em] text-[#C49A50]">
              Customer Support
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-[#F7F0E3]/70">
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#C49A50] shrink-0" />
                <a
                  href="mailto:support@maghora.com"
                  className="hover:text-[#F7F0E3] transition-colors"
                >
                  support@maghora.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#C49A50] shrink-0 mt-0.5" />
                <span>Mithila Sourcing Hub, Bihar, India</span>
              </li>
            </ul>

            {/* Social Channels */}
            <div className="pt-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#F7F0E3]/50 block mb-2 font-semibold">
                Follow Our Journey
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Maghora on Instagram"
                  className="h-8 w-8 rounded-full bg-[#F7F0E3]/10 hover:bg-[#F7F0E3]/25 flex items-center justify-center transition-colors"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Maghora on Facebook"
                  className="h-8 w-8 rounded-full bg-[#F7F0E3]/10 hover:bg-[#F7F0E3]/25 flex items-center justify-center transition-colors"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Maghora on X"
                  className="h-8 w-8 rounded-full bg-[#F7F0E3]/10 hover:bg-[#F7F0E3]/25 flex items-center justify-center transition-colors"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="mt-12 pt-6 border-t border-[#F7F0E3]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#F7F0E3]/50">
          <p>&copy; {new Date().getFullYear()} Maghora. All rights reserved. Slow roasted in pure olive oil.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-[#F7F0E3] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#F7F0E3] transition-colors">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
