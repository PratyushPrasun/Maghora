"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  Search,
  LogOut,
  Package,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  MapPin,
  Mail,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useCartStore } from "@/stores/useCartStore";
import { useProducts } from "@/hooks/useProducts";
import { MithilaLotus } from "./MithilaMotifs";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const { openCart } = useCartStore();

  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ==========================================
  // EXACT SCROLL BEHAVIOUR IMPLEMENTATION
  // ==========================================
  // 1. At very top of page: navbar is visible.
  // 2. When scrolling DOWN: navbar smoothly disappears.
  // 3. When scrolling UP: navbar smoothly reappears.
  // 4. When scrolling all the way to footer: navbar remains hidden.
  // 5. When scrolling upward from footer towards top: navbar reappears.
  // 6. When user reaches the top: navbar is visible.
  // 7. Small scroll threshold to eliminate micro-jitter and flickering.
  // 8. Zero layout shifts using sticky + CSS transform.
  // ==========================================
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const { data: productsData } = useProducts({ limit: 24 });
  const allProducts = productsData?.products || [];

  const filteredProducts = searchQuery.trim()
    ? allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    const SCROLL_THRESHOLD = 8; // Small threshold to eliminate micro-scroll jitter

    const handleScroll = () => {
      // Keep navbar visible when drawer or search is active
      if (menuDrawerOpen || searchOpen) {
        setIsVisible(true);
        return;
      }

      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const isAtBottom = windowHeight + currentScrollY >= docHeight - 25;

      // Track if page has scrolled away from top
      setIsScrolled(currentScrollY > 15);

      // Rule 1 & 6: At top of page, navbar is always visible
      if (currentScrollY <= 25) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Ignore negative scroll values (e.g. mobile overscroll bounce at top)
      if (currentScrollY < 0) {
        setIsVisible(true);
        return;
      }

      const delta = currentScrollY - lastScrollY.current;

      // Ignore tiny micro-scroll movements below threshold
      if (Math.abs(delta) < SCROLL_THRESHOLD) {
        return;
      }

      // Rule 2 & 4: When scrolling DOWN, smoothly hide navbar.
      // When scrolling all the way to footer, navbar remains hidden.
      if (delta > SCROLL_THRESHOLD) {
        setIsVisible(false);
        setUserDropdownOpen(false);
      }
      // Rule 3 & 5: When scrolling UP, navbar smoothly reappears.
      // When scrolling upward from footer towards top, navbar reappears.
      else if (delta < -SCROLL_THRESHOLD) {
        // Prevent false-positive bottom bounce trigger when reaching the very end
        if (isAtBottom && Math.abs(delta) < 14) {
          return;
        }
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuDrawerOpen, searchOpen]);

  // Focus search input when search modal opens
  useEffect(() => {
    if (searchOpen) {
      const timer = setTimeout(() => searchInputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [searchOpen]);

  // Lock body scroll when mobile drawer or search is active
  useEffect(() => {
    if (menuDrawerOpen || searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuDrawerOpen, searchOpen]);

  // Gracefully close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };

    if (userDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userDropdownOpen]);

  // Close dropdown on navigation during render
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setUserDropdownOpen(false);
  }

  const isNavbarVisible = isVisible || menuDrawerOpen || searchOpen;
  const totalCartCount = cart?.itemCount || 0;

  const scrollToProducts = () => {
    setMenuDrawerOpen(false);
    if (pathname === "/") {
      const el = document.getElementById("products");
      if (el) {
        const headerOffset = window.innerWidth < 640 ? 68 : 80;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        window.history.pushState(null, "", "#products");
      }
    } else {
      router.push("/#products");
    }
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    setMenuDrawerOpen(false);
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "/");
    }
  };

  return (
    <>
      {/* 1. Cultural Announcement Band (Refined, Compact, Heritage-Inspired) */}
      <div className="bg-[#702C32] text-[#F8EEDC] text-center py-1 sm:py-1.5 px-2 sm:px-4 text-[9px] sm:text-[11px] font-medium tracking-[0.08em] sm:tracking-[0.22em] uppercase select-none border-b border-[#E8B84E]/20 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-1.5 sm:gap-4 whitespace-nowrap overflow-hidden text-ellipsis">
          <span className="opacity-95 font-serif font-bold text-[#E8B84E]">Maghora</span>
          <span className="text-[#E8B84E]/60 text-xs">✦</span>
          <span className="opacity-90 hidden sm:inline">Mithila Heritage</span>
          <span className="text-[#E8B84E]/60 text-xs hidden sm:inline">✦</span>
          <span className="opacity-90">Roasted in Olive Oil</span>
          <span className="text-[#E8B84E]/60 text-xs hidden md:inline">✦</span>
          <span className="hidden md:inline opacity-90">GI-Origin Bihar Makhana</span>
          <span className="text-[#E8B84E]/60 text-xs">✦</span>
          <span className="text-[#E8B84E] font-semibold">Free Shipping ₹499+</span>
        </div>
      </div>

      {/* 2. Main Slim, Premium Sticky Navbar with Exact Scroll Show/Hide Physics */}
      <header
        className={`sticky top-0 z-40 w-full transition-transform duration-300 ease-in-out ${
          isNavbarVisible ? "translate-y-0" : "-translate-y-full pointer-events-none"
        } ${
          isScrolled
            ? "bg-[#F8EEDC]/95 backdrop-blur-md border-b border-[#E8D7BE] shadow-[0_4px_20px_rgba(51,37,31,0.06)]"
            : "bg-[#F8EEDC] border-b border-[#E8D7BE]/60"
        }`}
      >
        <div className="mx-auto max-w-7xl px-2.5 sm:px-6 lg:px-8 h-15 sm:h-[68px] lg:h-[76px]">
          {/* Desktop 3-Column Balanced Layout / Mobile Flex Layout (prevents overlapping) */}
          <div className="flex items-center justify-between lg:grid lg:grid-cols-3 h-full gap-1.5 sm:gap-4">
            {/* FAR LEFT: Maghora Brand Logo (Aligned to extreme left) */}
            <div className="flex items-center justify-start min-w-0 shrink">
              <Link
                href="/"
                onClick={handleHomeClick}
                className="group flex items-center gap-1.5 sm:gap-2.5 min-w-0 cursor-pointer transition-opacity hover:opacity-90"
                aria-label="Maghora — Return to home"
              >
                {/* Logo mark — nicely sized across devices */}
                <div className="relative h-11 w-11 sm:h-12 sm:w-12 lg:h-[58px] lg:w-[58px] shrink-0 aspect-square">
                  <Image
                    src="/logo-mark.png"
                    alt="Maghora — Traditional Mithila Heritage Foods"
                    fill
                    priority
                    sizes="(max-width: 640px) 44px, (max-width: 1024px) 48px, 58px"
                    className="object-contain drop-shadow-[0_2px_8px_rgba(112,44,50,0.12)] select-none transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                {/* Brand name + Tagline beside the logo */}
                <div className="flex flex-col min-w-0 justify-center">
                  <span className="font-serif font-extrabold text-xs sm:text-base lg:text-lg text-[#702C32] tracking-[0.10em] sm:tracking-[0.16em] leading-tight select-none">
                    MAGHORA
                  </span>
                  <span className="text-[7.5px] xs:text-[8.5px] sm:text-[9.5px] lg:text-[10px] uppercase tracking-[0.05em] sm:tracking-[0.18em] text-[#C65D35] font-semibold leading-tight mt-0.5 whitespace-nowrap">
                    Ancient Roots, Modern Taste
                  </span>
                </div>
              </Link>
            </div>

            {/* MIDDLE: Primary Navigation Links (Home, Shop, About, Contact) — Centered & Evenly Spaced */}
            <nav
              className="hidden lg:flex items-center justify-center gap-7 xl:gap-9"
              aria-label="Main Navigation"
            >
              {/* Home */}
              <Link
                href="/"
                onClick={handleHomeClick}
                className={`text-xs font-serif font-bold uppercase tracking-[0.24em] transition-colors py-1 relative group ${
                  pathname === "/" ? "text-[#702C32]" : "text-[#33251F]/80 hover:text-[#702C32]"
                }`}
              >
                <span>Home</span>
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-[#702C32] rounded-full transition-all duration-300 ${
                    pathname === "/" ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>

              {/* Shop (Smoothly scrolls to #products on homepage from anywhere) */}
              <button
                onClick={scrollToProducts}
                className="text-xs font-serif font-bold uppercase tracking-[0.24em] text-[#33251F]/80 hover:text-[#702C32] transition-colors py-1 relative group cursor-pointer"
              >
                <span>Shop</span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#702C32] rounded-full transition-all duration-300 group-hover:w-full" />
              </button>

              {/* All Products (Redirects to full /products catalog) */}
              <Link
                href="/products"
                className={`text-xs font-serif font-bold uppercase tracking-[0.24em] transition-colors py-1 relative group ${
                  pathname === "/products" ? "text-[#702C32]" : "text-[#33251F]/80 hover:text-[#702C32]"
                }`}
              >
                <span>Products</span>
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-[#702C32] rounded-full transition-all duration-300 ${
                    pathname === "/products" ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>

              {/* About (Redirects to dedicated /about page) */}
              <Link
                href="/about"
                className={`text-xs font-serif font-bold uppercase tracking-[0.24em] transition-colors py-1 relative group ${
                  pathname === "/about" ? "text-[#702C32]" : "text-[#33251F]/80 hover:text-[#702C32]"
                }`}
              >
                <span>About</span>
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-[#702C32] rounded-full transition-all duration-300 ${
                    pathname === "/about" ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>

              {/* Contact (Redirects to dedicated /contact page) */}
              <Link
                href="/contact"
                className={`text-xs font-serif font-bold uppercase tracking-[0.24em] transition-colors py-1 relative group ${
                  pathname === "/contact" ? "text-[#702C32]" : "text-[#33251F]/80 hover:text-[#702C32]"
                }`}
              >
                <span>Contact</span>
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-[#702C32] rounded-full transition-all duration-300 ${
                    pathname === "/contact" ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            </nav>

            {/* FAR RIGHT: Search, Account and Cart Icons (Grouped neatly on the right) */}
            <div className="flex items-center justify-end gap-0.5 sm:gap-2 shrink-0">
              {/* Search Icon */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-1.5 sm:p-2.5 min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center text-[#33251F]/80 hover:text-[#702C32] hover:bg-[#EEDEC4]/60 rounded-full transition-colors cursor-pointer group"
                aria-label="Search flavours"
                title="Search products"
              >
                <Search className="h-4.5 w-4.5 sm:h-5 sm:w-5 transition-transform group-hover:scale-105" />
              </button>

              {/* User Account / Profile Menu (Graceful for both Authenticated & Guest states) */}
              <div className="relative" ref={userDropdownRef}>
                {isAuthenticated ? (
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center p-0.5 sm:p-1 rounded-full hover:bg-[#EEDEC4]/60 transition-all cursor-pointer group focus-visible:outline-2 focus-visible:outline-[#702C32]"
                    aria-label="User account menu"
                    aria-expanded={userDropdownOpen}
                    title="My Account"
                  >
                    <div className="h-7.5 w-7.5 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-[#702C32] to-[#551F24] text-[#F8EEDC] flex items-center justify-center text-xs font-serif font-bold shadow-xs ring-2 ring-[#E8B84E]/30 group-hover:ring-[#E8B84E] transition-all">
                      {user?.name?.charAt(0).toUpperCase() || "M"}
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="p-1.5 sm:p-2.5 min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center text-[#33251F]/80 hover:text-[#702C32] hover:bg-[#EEDEC4]/60 rounded-full transition-colors cursor-pointer group focus-visible:outline-2 focus-visible:outline-[#702C32]"
                    aria-label="Account menu"
                    aria-expanded={userDropdownOpen}
                    title="Account &amp; Sign In"
                  >
                    <UserIcon className="h-4.5 w-4.5 sm:h-5 sm:w-5 transition-transform group-hover:scale-105" />
                  </button>
                )}

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute right-0 mt-2.5 w-[calc(100vw-2rem)] max-w-[290px] sm:max-w-xs sm:w-80 rounded-2xl sm:rounded-3xl border border-[#E8D7BE] bg-[#FDF9F0] p-3 sm:p-3.5 shadow-[0_16px_40px_rgba(51,37,31,0.14)] z-50 text-[#33251F] overflow-hidden"
                    >
                      {/* Decorative Mithila gold ribbon accent */}
                      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#702C32] via-[#E8B84E] to-[#702C32]" />

                      {isAuthenticated ? (
                        <div>
                          {/* User Header Profile Card */}
                          <div className="p-3 rounded-2xl bg-white/85 border border-[#E8D7BE]/70 shadow-2xs mb-2 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#702C32] to-[#551F24] text-[#F8EEDC] flex items-center justify-center text-sm font-serif font-bold shadow-xs ring-1 ring-[#E8B84E]/40 shrink-0">
                              {user?.name?.charAt(0).toUpperCase() || "M"}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <p className="text-xs font-serif font-bold text-[#702C32] truncate">
                                  {user?.name}
                                </p>
                                {isAdmin && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[#702C32]/10 text-[#702C32] uppercase tracking-wider">
                                    Admin
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-[#7B685F] truncate">
                                {user?.email}
                              </p>
                            </div>
                          </div>

                          {/* Navigation Options */}
                          <div className="space-y-1">
                            {isAdmin && (
                              <Link
                                href="/admin/dashboard"
                                onClick={() => setUserDropdownOpen(false)}
                                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#702C32] hover:bg-[#EEDEC4]/60 rounded-xl transition-colors group"
                              >
                                <div className="h-7 w-7 rounded-lg bg-[#702C32]/10 flex items-center justify-center text-[#702C32]">
                                  <ShieldCheck className="h-4 w-4" />
                                </div>
                                <span className="font-semibold">Admin Portal</span>
                              </Link>
                            )}

                            <Link
                              href="/account"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#33251F] hover:bg-[#EEDEC4]/60 rounded-xl transition-colors group"
                            >
                              <div className="h-7 w-7 rounded-lg bg-white border border-[#E8D7BE]/60 flex items-center justify-center text-[#702C32] group-hover:border-[#702C32]/30">
                                <UserIcon className="h-3.5 w-3.5" />
                              </div>
                              <span>My Profile</span>
                            </Link>

                            <Link
                              href="/orders"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#33251F] hover:bg-[#EEDEC4]/60 rounded-xl transition-colors group"
                            >
                              <div className="h-7 w-7 rounded-lg bg-white border border-[#E8D7BE]/60 flex items-center justify-center text-[#702C32] group-hover:border-[#702C32]/30">
                                <Package className="h-3.5 w-3.5" />
                              </div>
                              <div className="flex-1 flex items-center justify-between">
                                <span>My Orders</span>
                                <span className="text-[10px] text-[#7B685F]">Track</span>
                              </div>
                            </Link>

                            <Link
                              href="/account"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#33251F] hover:bg-[#EEDEC4]/60 rounded-xl transition-colors group"
                            >
                              <div className="h-7 w-7 rounded-lg bg-white border border-[#E8D7BE]/60 flex items-center justify-center text-[#702C32] group-hover:border-[#702C32]/30">
                                <MapPin className="h-3.5 w-3.5" />
                              </div>
                              <span>Saved Addresses</span>
                            </Link>
                          </div>

                          <div className="my-1.5 border-t border-[#E8D7BE]/70" />

                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              logout();
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50/80 rounded-xl transition-colors text-left cursor-pointer"
                          >
                            <div className="h-7 w-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                              <LogOut className="h-3.5 w-3.5" />
                            </div>
                            <span>Sign Out</span>
                          </button>
                        </div>
                      ) : (
                        <div>
                          {/* Guest Welcome Card */}
                          <div className="p-3.5 rounded-2xl bg-white/85 border border-[#E8D7BE]/70 text-center shadow-2xs mb-2">
                            <div className="flex items-center justify-center gap-1.5 mb-1 text-[#702C32]">
                              <MithilaLotus className="h-3.5 w-3.5 text-[#E8B84E]" />
                              <span className="font-serif font-bold text-xs uppercase tracking-[0.2em]">
                                Welcome
                              </span>
                              <MithilaLotus className="h-3.5 w-3.5 text-[#E8B84E]" />
                            </div>
                            <p className="text-[11px] text-[#7B685F] leading-tight mb-3">
                              Sign in to access your orders, profile &amp; member benefits.
                            </p>
                            <div className="space-y-1.5">
                              <Link
                                href="/login"
                                onClick={() => setUserDropdownOpen(false)}
                                className="block w-full py-2.5 rounded-xl bg-[#702C32] hover:bg-[#551F24] text-[#F8EEDC] text-xs font-serif font-bold uppercase tracking-[0.18em] transition-all shadow-sm text-center cursor-pointer"
                              >
                                Sign In
                              </Link>
                              <Link
                                href="/register"
                                onClick={() => setUserDropdownOpen(false)}
                                className="block w-full py-2 rounded-xl bg-white hover:bg-[#F8EEDC] text-[#33251F] border border-[#E8D7BE] text-[11px] font-serif font-semibold uppercase tracking-wider transition-all text-center cursor-pointer"
                              >
                                Create an Account
                              </Link>
                            </div>
                          </div>

                          {/* Quick Links for Guests */}
                          <div className="space-y-1 pt-1">
                            <Link
                              href="/orders"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#33251F] hover:bg-[#EEDEC4]/60 rounded-xl transition-colors"
                            >
                              <Package className="h-3.5 w-3.5 text-[#702C32]" />
                              <span>Track Orders</span>
                            </Link>
                            <Link
                              href="/contact"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#33251F] hover:bg-[#EEDEC4]/60 rounded-xl transition-colors"
                            >
                              <Mail className="h-3.5 w-3.5 text-[#702C32]" />
                              <span>Customer Support</span>
                            </Link>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Shopping Cart Button */}
              <button
                onClick={openCart}
                className="relative p-1.5 sm:p-2.5 min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center text-[#33251F]/80 hover:text-[#702C32] hover:bg-[#EEDEC4]/60 rounded-full transition-colors cursor-pointer group"
                aria-label={`Open shopping cart with ${totalCartCount} items`}
                title="Cart"
              >
                <ShoppingBag className="h-4.5 w-4.5 sm:h-5 sm:w-5 transition-transform group-hover:scale-105" />
                {totalCartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 flex h-4 min-w-4 sm:h-4.5 sm:min-w-4.5 items-center justify-center rounded-full bg-[#702C32] px-1 text-[9px] sm:text-[10px] font-bold text-[#F8EEDC] shadow-xs">
                    {totalCartCount}
                  </span>
                )}
              </button>

              {/* Mobile Hamburger Menu Button (Shown on mobile & tablet < lg) */}
              <button
                onClick={() => setMenuDrawerOpen(true)}
                className="lg:hidden p-1.5 min-h-[36px] min-w-[36px] flex items-center justify-center text-[#33251F] hover:text-[#702C32] hover:bg-[#EEDEC4]/60 rounded-full transition-colors cursor-pointer active:scale-95"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5 stroke-[2.2]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 3. MOBILE NAVIGATION DRAWER */}
      <AnimatePresence>
        {menuDrawerOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              aria-hidden="true"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-[85vw] max-w-xs h-full bg-[#F8EEDC] shadow-2xl flex flex-col justify-between p-5 sm:p-6 z-50 border-r border-[#E8D7BE] overflow-y-auto pt-[calc(1.25rem+env(safe-area-inset-top,0px))] pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))]"
            >
              <div>
                {/* Mobile Drawer Header with Logo & Brand Name */}
                <div className="flex items-center justify-between pb-4 border-b border-[#E8D7BE]">
                  <Link
                    href="/"
                    onClick={handleHomeClick}
                    className="flex items-center gap-2.5 cursor-pointer"
                  >
                    <div className="relative h-13 w-13 shrink-0 aspect-square">
                      <Image
                        src="/logo-mark.png"
                        alt="Maghora"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <span className="font-serif font-extrabold text-base text-[#702C32] tracking-[0.16em] block leading-none">
                        MAGHORA
                      </span>
                      <span className="text-[9px] uppercase tracking-[0.22em] text-[#C65D35] font-semibold">
                        Ancient Roots, Modern Taste
                      </span>
                    </div>
                  </Link>

                  <button
                    onClick={() => setMenuDrawerOpen(false)}
                    className="p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full text-[#33251F]/70 hover:text-[#702C32] hover:bg-[#EEDEC4] transition-colors cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* In-drawer Quick Search Trigger */}
                <div className="mt-4">
                  <button
                    onClick={() => {
                      setMenuDrawerOpen(false);
                      setSearchOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white border border-[#E8D7BE] text-xs text-[#7B685F] text-left hover:border-[#702C32]/40 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Search className="h-4 w-4 text-[#702C32]" />
                    <span>Search flavours, spices...</span>
                  </button>
                </div>

                {/* Primary Mobile Navigation Links */}
                <nav className="mt-4 space-y-1.5">
                  {/* Home */}
                  <Link
                    href="/"
                    onClick={handleHomeClick}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-serif font-bold tracking-[0.18em] uppercase transition-all ${
                      pathname === "/"
                        ? "bg-[#702C32] text-[#F8EEDC] shadow-sm"
                        : "text-[#33251F] hover:bg-[#EEDEC4]/60"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <MithilaLotus className="h-3.5 w-3.5 text-[#E8B84E]" />
                      <span>Home</span>
                    </span>
                    <ChevronRight className="h-4 w-4 opacity-60" />
                  </Link>

                  {/* Shop */}
                  <button
                    onClick={scrollToProducts}
                    className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-serif font-bold tracking-[0.18em] uppercase text-[#33251F] hover:bg-[#EEDEC4]/60 transition-all text-left cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <ShoppingBag className="h-3.5 w-3.5 text-[#702C32]" />
                      <span>Shop Flavours</span>
                    </span>
                    <ChevronRight className="h-4 w-4 opacity-60" />
                  </button>

                  {/* About */}
                  <Link
                    href="/about"
                    onClick={() => setMenuDrawerOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-serif font-bold tracking-[0.18em] uppercase transition-all ${
                      pathname === "/about"
                        ? "bg-[#702C32] text-[#F8EEDC] shadow-sm"
                        : "text-[#33251F] hover:bg-[#EEDEC4]/60"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Sparkles className="h-3.5 w-3.5 text-[#C65D35]" />
                      <span>About Our Heritage</span>
                    </span>
                    <ChevronRight className="h-4 w-4 opacity-60" />
                  </Link>

                  {/* All Products Catalogue */}
                  <Link
                    href="/products"
                    onClick={() => setMenuDrawerOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-serif font-bold tracking-[0.18em] uppercase transition-all ${
                      pathname === "/products"
                        ? "bg-[#702C32] text-[#F8EEDC] shadow-sm"
                        : "text-[#33251F] hover:bg-[#EEDEC4]/60"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Package className="h-3.5 w-3.5 text-[#536B42]" />
                      <span>All Products</span>
                    </span>
                    <ChevronRight className="h-4 w-4 opacity-60" />
                  </Link>

                  {/* Contact */}
                  <Link
                    href="/contact"
                    onClick={() => setMenuDrawerOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-serif font-bold tracking-[0.18em] uppercase transition-all ${
                      pathname === "/contact"
                        ? "bg-[#702C32] text-[#F8EEDC] shadow-sm"
                        : "text-[#33251F] hover:bg-[#EEDEC4]/60"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Mail className="h-3.5 w-3.5 text-[#702C32]" />
                      <span>Contact Us</span>
                    </span>
                    <ChevronRight className="h-4 w-4 opacity-60" />
                  </Link>
                </nav>

                {/* Cultural Micro-Banner in Drawer */}
                <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-[#FDF9F0] to-[#EEDEC4]/40 border border-[#E8D7BE]/70 text-[10px] text-[#702C32] font-serif font-semibold text-center">
                  ✦ Slow-Roasted in Olive Oil ✦
                </div>
              </div>

              {/* Bottom Drawer Actions */}
              <div className="pt-4 border-t border-[#E8D7BE] space-y-2.5">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-white border border-[#E8D7BE] flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-[#702C32] text-[#F8EEDC] flex items-center justify-center text-xs font-serif font-bold shrink-0">
                        {user?.name?.charAt(0).toUpperCase() || "M"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-[#33251F] truncate">{user?.name}</p>
                        <p className="text-[10px] text-[#7B685F] truncate">{user?.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/account"
                        onClick={() => setMenuDrawerOpen(false)}
                        className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-white border border-[#E8D7BE] text-xs font-semibold text-[#33251F] hover:bg-[#F8EEDC]"
                      >
                        <UserIcon className="h-3.5 w-3.5 text-[#702C32]" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        href="/orders"
                        onClick={() => setMenuDrawerOpen(false)}
                        className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-white border border-[#E8D7BE] text-xs font-semibold text-[#33251F] hover:bg-[#F8EEDC]"
                      >
                        <Package className="h-3.5 w-3.5 text-[#702C32]" />
                        <span>Orders</span>
                      </Link>
                    </div>

                    {isAdmin && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setMenuDrawerOpen(false)}
                        className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-[#702C32]/10 border border-[#702C32]/20 text-xs font-semibold text-[#702C32]"
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setMenuDrawerOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center justify-center gap-2 p-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMenuDrawerOpen(false)}
                    className="block w-full py-3 rounded-xl bg-[#702C32] text-[#F8EEDC] text-center text-xs font-serif font-bold uppercase tracking-[0.2em] shadow-md hover:bg-[#551F24] transition-colors"
                  >
                    Sign In / Register
                  </Link>
                )}

                <div className="text-center pt-1">
                  <p className="text-[10px] text-[#7B685F] uppercase tracking-[0.2em] font-serif flex items-center justify-center gap-1.5">
                    <MithilaLotus className="h-3 w-3 text-[#E8B84E]" />
                    <span>Swaad Mithila Ka</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. QUICK SEARCH OVERLAY MODAL */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              aria-hidden="true"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-xl rounded-3xl bg-[#F8EEDC] border border-[#E8D7BE] p-6 shadow-2xl z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8D7BE]">
                <div className="flex items-center gap-2 text-xs font-serif font-bold uppercase tracking-[0.2em] text-[#702C32]">
                  <MithilaLotus className="h-4 w-4 text-[#E8B84E]" />
                  <span>Search Maghora Flavours</span>
                </div>
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-1.5 rounded-full text-[#33251F]/70 hover:text-[#702C32] hover:bg-[#EEDEC4] transition-colors cursor-pointer"
                  aria-label="Close search"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="relative mb-5">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#7B685F]" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by flavour, spice, or origin..."
                  className="w-full h-12 rounded-2xl bg-white border border-[#E8D7BE] pl-12 pr-4 text-sm text-[#33251F] placeholder:text-[#7B685F]/60 focus:outline-none focus:ring-2 focus:ring-[#702C32]/30 shadow-inner"
                />
              </div>

              {/* Real-time search results */}
              <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                {searchQuery.trim() === "" ? (
                  <div className="text-center py-8 text-xs text-[#7B685F]">
                    <Sparkles className="h-6 w-6 text-[#E8B84E] mx-auto mb-2" />
                    <span>Try searching for &quot;Pink Salt&quot;, &quot;Peri Peri&quot;, or &quot;Mint&quot;</span>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-8 text-xs text-[#7B685F]">
                    No matching flavours found for &quot;{searchQuery}&quot;
                  </div>
                ) : (
                  filteredProducts.map((p) => {
                    const img =
                      p.images?.find((i) => i.isPrimary)?.url ||
                      p.images?.[0]?.url ||
                      "/logo-mark.png";
                    const price = p.variants?.[0]?.pricePaise
                      ? `₹${(p.variants[0].pricePaise / 100).toFixed(0)}`
                      : "";

                    return (
                      <Link
                        key={p._id}
                        href={`/products/${p.slug}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/80 hover:bg-white border border-[#E8D7BE]/70 transition-all hover:shadow-xs group cursor-pointer"
                      >
                        <div className="relative h-12 w-12 rounded-xl bg-[#F8EEDC] overflow-hidden shrink-0 border border-[#E8D7BE]/50">
                          <Image
                            src={img}
                            alt={p.name}
                            fill
                            className="object-contain p-1 group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-serif font-bold text-[#33251F] group-hover:text-[#702C32] truncate transition-colors">
                            {p.name}
                          </p>
                          {p.shortDescription && (
                            <p className="text-[11px] text-[#7B685F] truncate">
                              {p.shortDescription}
                            </p>
                          )}
                        </div>
                        {price && (
                          <span className="text-xs font-bold text-[#702C32] shrink-0 font-serif">
                            {price}
                          </span>
                        )}
                      </Link>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
