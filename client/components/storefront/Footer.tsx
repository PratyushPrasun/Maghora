"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { MithilaLotus, MithilaBorderRibbon, MithilaCorner } from "./MithilaMotifs";

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

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919288494099";
  const contactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE || "+918893932380";
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "maghora0408@gmail.com";

  return (
    <footer className="relative bg-[#702C32] text-[#F8EEDC] overflow-hidden">
      {/* Handcrafted Organic Curve Transition into Deep Maroon */}
      <div className="relative w-full overflow-hidden leading-none select-none">
        <svg
          viewBox="0 0 1440 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-8 sm:h-12 block"
        >
          <path
            d="M0,0 C360,40 720,15 1080,35 C1260,45 1380,20 1440,15 L1440,48 L0,48 Z"
            fill="#702C32"
          />
        </svg>
      </div>

      {/* Decorative Traditional Mithila Ribbon */}
      <div className="opacity-70 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MithilaBorderRibbon className="w-full h-2.5" />
      </div>

      <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 py-8 sm:py-14 relative">
        {/* Subtle Corner Motif Accents */}
        <MithilaCorner className="absolute top-4 left-4 h-6 w-6 text-[#E8B84E]/30 hidden sm:block" />
        <MithilaCorner className="absolute top-4 right-4 h-6 w-6 text-[#E8B84E]/30 rotate-90 hidden sm:block" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">
          {/* Brand Identity & Logo Column */}
          <div className="md:col-span-5 space-y-3.5 sm:space-y-4">
            <Link
              href="/"
              onClick={handleHomeClick}
              className="inline-flex items-center gap-3 sm:gap-3.5 group cursor-pointer"
            >
              <div className="relative h-14 w-14 sm:h-[68px] sm:w-[68px] shrink-0 rounded-2xl bg-[#F8EEDC] p-1.5 shadow-md">
                <Image
                  src="/logo.png"
                  alt="Maghora"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <span className="font-serif text-xl sm:text-2xl font-extrabold tracking-[0.18em] sm:tracking-[0.2em] text-[#F8EEDC] block leading-none transition-colors group-hover:text-[#E8B84E]">
                  MAGHORA
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.24em] text-[#E8B84E] mt-1 block font-serif">
                  Ancient Roots, Modern Taste
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-[13px] text-[#F8EEDC]/80 leading-relaxed max-w-sm font-normal">
              Slow-roasted in Olive Oil, seasoned with stone-ground Indian spices. Sourced directly from certified wetland farmers in Mithila, Bihar.
            </p>

            <div className="flex items-center gap-2 text-xs text-[#E8B84E] pt-0.5">
              <MithilaLotus className="h-4 w-4 text-[#E8B84E]" />
              <span className="tracking-[0.16em] sm:tracking-[0.18em] uppercase text-[9px] sm:text-[10px] font-bold font-serif">
                Protected GI Origin · Bihar, India
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-2.5 sm:space-y-3">
            <h4 className="font-serif text-xs font-bold uppercase tracking-[0.22em] sm:tracking-[0.24em] text-[#E8B84E]">
              Explore
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-[13px]">
              <li>
                <Link
                  href="/"
                  onClick={handleHomeClick}
                  className="text-[#F8EEDC]/75 hover:text-[#E8B84E] transition-colors py-0.5 inline-block"
                >
                  Home
                </Link>
              </li>
              <li>
                <button
                  onClick={(e) => handleNavClick(e, "#products")}
                  className="text-[#F8EEDC]/75 hover:text-[#E8B84E] transition-colors cursor-pointer text-left py-0.5"
                >
                  Shop Flavours
                </button>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-[#F8EEDC]/75 hover:text-[#E8B84E] transition-colors py-0.5 inline-block"
                >
                  About Our Heritage
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-[#F8EEDC]/75 hover:text-[#E8B84E] transition-colors py-0.5 inline-block"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[#F8EEDC]/75 hover:text-[#E8B84E] transition-colors py-0.5 inline-block"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support & Socials */}
          <div className="md:col-span-4 space-y-3 sm:space-y-3.5">
            <h4 className="font-serif text-xs font-bold uppercase tracking-[0.22em] sm:tracking-[0.24em] text-[#E8B84E]">
              Customer Care
            </h4>
            <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-[13px] text-[#F8EEDC]/80">
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#E8B84E] shrink-0" />
                <a
                  href={`mailto:${contactEmail}`}
                  className="hover:text-[#E8B84E] transition-colors py-0.5 inline-block"
                >
                  {contactEmail}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#E8B84E] shrink-0" />
                <a
                  href={`tel:${contactPhone}`}
                  className="hover:text-[#E8B84E] transition-colors py-0.5 inline-block"
                >
                  +91 88939 32380
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="h-4 w-4 text-[#E8B84E] shrink-0" />
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#E8B84E] transition-colors py-0.5 inline-block"
                >
                  WhatsApp: +91 92884 94099
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#E8B84E] shrink-0 mt-0.5" />
                <span>Patna, Bihar, India</span>
              </li>
            </ul>

            <div className="pt-1.5 sm:pt-2">
              <span className="text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.22em] text-[#E8B84E] block mb-2 font-bold font-serif">
                Follow Maghora
              </span>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://www.instagram.com/_maghora/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Maghora on Instagram"
                  className="h-8.5 w-8.5 sm:h-8 sm:w-8 rounded-full bg-white/10 hover:bg-[#E8B84E] hover:text-[#702C32] text-[#F8EEDC] flex items-center justify-center transition-all duration-200 cursor-pointer"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a
                  href="https://m.facebook.com/1379285275260552/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Maghora on Facebook"
                  className="h-8.5 w-8.5 sm:h-8 sm:w-8 rounded-full bg-white/10 hover:bg-[#E8B84E] hover:text-[#702C32] text-[#F8EEDC] flex items-center justify-center transition-all duration-200 cursor-pointer"
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
                  className="h-8.5 w-8.5 sm:h-8 sm:w-8 rounded-full bg-white/10 hover:bg-[#E8B84E] hover:text-[#702C32] text-[#F8EEDC] flex items-center justify-center transition-all duration-200 cursor-pointer"
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
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-[#F8EEDC]/15 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 text-[10px] sm:text-[11px] text-[#F8EEDC]/60 text-center sm:text-left">
          <p>&copy; {new Date().getFullYear()} Maghora. All rights reserved. Swaad Mithila Ka.</p>
          <div className="flex items-center gap-4 sm:gap-5">
            <Link href="/privacy" className="hover:text-[#E8B84E] transition-colors py-1">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#E8B84E] transition-colors py-1">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
