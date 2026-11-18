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
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useCartStore } from "@/stores/useCartStore";
import { Button } from "@/components/ui/button";
import { MithilaLotus } from "./MithilaMotifs";

const ANNOUNCEMENTS = [
  "✦ Direct from Mithila Wetlands · Roasted in Pure Olive Oil",
  "✦ Free Express Delivery on Orders Above ₹499 Across India",
  "✦ 100% Roasted · Zero Palm Oil · FSSAI Certified Vegetarian",
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const { openCart } = useCartStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [announcementIdx, setAnnouncementIdx] = useState(0);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Announcement rotator
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIdx((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Sticky header transition on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Focus search input when open
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery("");
  };

  const navLinks = [
    { name: "Shop All", href: "/products" },
    { name: "Collections", href: "/categories" },
    { name: "7 Flavours", href: "/#flavours" },
    { name: "Mithila Heritage", href: "/#story" },
    { name: "Why Maghora", href: "/#why-us" },
    { name: "Rituals & Pairings", href: "/#lifestyle" },
  ];

  const totalCartCount = cart?.itemCount || 0;

  return (
    <>
      {/* 1. SLIM PROMOTIONAL ANNOUNCEMENT BAR */}
      <div className="relative z-50 bg-[#244C38] text-[#F7F0E3] px-3 py-1.5 overflow-hidden border-b border-[#C49A50]/30 select-none">
        <div className="mx-auto max-w-7xl flex items-center justify-between text-[11px] sm:text-xs">
          <div className="hidden lg:flex items-center gap-1.5 text-[#C49A50] font-medium tracking-wider uppercase text-[10px]">
            <MithilaLotus className="h-3 w-3 text-[#C49A50]" />
            <span>Sacred Harvest of Bihar</span>
          </div>

          <div className="w-full lg:w-auto text-center font-medium tracking-wide">
            <AnimatePresence mode="wait">
              <motion.span
                key={announcementIdx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="inline-block"
              >
                {ANNOUNCEMENTS[announcementIdx]}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-[11px] text-[#F7F0E3]/80">
            <Link href="/products" className="hover:text-[#C49A50] transition-colors">
              Explore Tasting Pack
            </Link>
          </div>
        </div>
      </div>

      {/* 2. REFINED HEADER AND DESKTOP NAVBAR */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-[#F7F0E3]/95 backdrop-blur-md shadow-[0_8px_30px_rgba(41,40,32,0.08)] border-b border-[#E2D7C3]"
            : "bg-[#F7F0E3]/90 backdrop-blur-sm border-b border-[#E2D7C3]/60"
        }`}
      >
        <div className="mx-auto flex h-[4.75rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo Placement & Typography */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-11 w-11 sm:h-12 sm:w-12 shrink-0 rounded-full border border-[#C49A50]/40 bg-white/80 p-1 shadow-xs transition-transform duration-300 group-hover:scale-105 group-hover:border-[#C49A50]">
              <Image
                src="/Magnora.png"
                alt="Maghora Mithila emblem"
                fill
                priority
                className="object-contain p-0.5"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.18em] text-[#292820] leading-none transition-colors group-hover:text-[#B85C38]">
                MAGHORA
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.24em] text-[#B85C38] uppercase mt-0.5">
                Mithila · Gourmet Makhana
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : link.href.startsWith("/#")
                  ? false
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-3 py-1.5 text-xs font-semibold tracking-wide transition-colors uppercase duration-200 rounded-full ${
                    isActive
                      ? "text-[#B85C38] bg-[#B85C38]/10"
                      : "text-[#292820]/80 hover:text-[#244C38] hover:bg-[#DCE5D7]/50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons: Search, Cart, Account */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Functional Search Toggle */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen((prev) => !prev)}
                className={`p-2.5 rounded-full transition-colors cursor-pointer ${
                  searchOpen
                    ? "bg-[#244C38] text-white"
                    : "text-[#292820]/80 hover:text-[#B85C38] hover:bg-[#EFE8DA]"
                }`}
                title="Search flavours"
                aria-label="Search flavours"
              >
                <Search className="h-4.5 w-4.5" />
              </button>

              {/* Quick Search Popover */}
              <AnimatePresence>
                {searchOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setSearchOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 mt-3 w-72 sm:w-80 rounded-2xl border border-[#E2D7C3] bg-white p-3 shadow-xl z-40"
                    >
                      <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search Peri Peri, Pudina, Salt..."
                          className="w-full text-xs bg-[#F7F0E3]/60 border border-[#E2D7C3] rounded-xl px-3 py-2 text-[#292820] placeholder:text-[#6E685C] focus:outline-none focus:ring-1 focus:ring-[#B85C38]"
                        />
                        <button
                          type="submit"
                          className="h-8 px-3 rounded-xl bg-[#B85C38] text-white text-xs font-semibold hover:bg-[#9A4928] transition-colors flex items-center justify-center shrink-0"
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </form>
                      <div className="mt-2.5 pt-2 border-t border-[#E2D7C3]/60 flex items-center justify-between text-[11px] text-[#6E685C]">
                        <span>Popular:</span>
                        <div className="flex gap-1.5">
                          {["Peri Peri", "Mac & Cheese", "Pudina"].map((term) => (
                            <button
                              key={term}
                              type="button"
                              onClick={() => {
                                router.push(`/products?search=${encodeURIComponent(term)}`);
                                setSearchOpen(false);
                              }}
                              className="hover:text-[#B85C38] underline-offset-2 hover:underline cursor-pointer"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2.5 text-[#292820]/80 hover:text-[#B85C38] hover:bg-[#EFE8DA] transition-colors rounded-full cursor-pointer"
              aria-label={`Shopping basket${totalCartCount ? `, ${totalCartCount} items` : ""}`}
            >
              <ShoppingBag className="h-5 w-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#B85C38] text-[10px] font-bold text-white shadow-sm animate-scale-in">
                  {totalCartCount > 9 ? "9+" : totalCartCount}
                </span>
              )}
            </button>

            {/* User Account / Auth Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full border border-[#E2D7C3] bg-white hover:bg-[#EFE8DA] transition-colors text-xs font-medium cursor-pointer"
                >
                  <span className="max-w-[90px] truncate font-semibold text-[#292820] hidden sm:inline">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <div className="h-7 w-7 rounded-full bg-[#244C38] text-[#F7F0E3] flex items-center justify-center text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className="h-3 w-3 text-[#6E685C] mr-0.5" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#E2D7C3] bg-white p-2 shadow-xl z-50 animate-in fade-in-50 zoom-in-95">
                      <div className="px-3 py-2 border-b border-[#E2D7C3]/60">
                        <p className="text-xs font-bold text-[#292820] truncate">{user?.name}</p>
                        <p className="text-[11px] text-[#6E685C] truncate">{user?.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/account"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#292820] hover:bg-[#EFE8DA] rounded-xl transition-colors"
                        >
                          <UserIcon className="h-4 w-4 text-[#B85C38]" />
                          My Profile
                        </Link>

                        <Link
                          href="/orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#292820] hover:bg-[#EFE8DA] rounded-xl transition-colors"
                        >
                          <Package className="h-4 w-4 text-[#B85C38]" />
                          My Orders
                        </Link>

                        {isAdmin && (
                          <Link
                            href="/admin/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#244C38] hover:bg-[#DCE5D7]/50 rounded-xl transition-colors"
                          >
                            <ShieldCheck className="h-4 w-4" />
                            Admin Console
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-[#E2D7C3]/60 pt-1">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 rounded-xl transition-colors cursor-pointer text-left"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button
                  size="sm"
                  className="hidden sm:inline-flex rounded-full bg-[#B85C38] hover:bg-[#9A4928] text-white text-xs px-4"
                >
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Drawer Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#292820] rounded-lg hover:bg-[#EFE8DA] cursor-pointer"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* 3. RESPONSIVE MOBILE NAVIGATION DRAWER */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 top-[calc(4.75rem+2rem)] z-40 bg-black/30 backdrop-blur-xs lg:hidden"
              />

              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="lg:hidden border-t border-[#E2D7C3] bg-[#F7F0E3] px-5 pt-4 pb-7 space-y-4 shadow-xl overflow-hidden relative z-50"
              >
                {/* Search Bar inside Mobile Menu */}
                <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search flavours..."
                    className="w-full text-xs bg-white border border-[#E2D7C3] rounded-xl px-3 py-2 text-[#292820] focus:outline-none focus:ring-1 focus:ring-[#B85C38]"
                  />
                  <Button type="submit" size="sm" className="rounded-xl bg-[#B85C38] text-white">
                    Search
                  </Button>
                </form>

                {/* Navigation Links */}
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2.5 px-3 rounded-xl text-sm font-semibold text-[#292820] hover:bg-[#DCE5D7]/50 hover:text-[#244C38] transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>

                {/* Quick Flavour Badges */}
                <div className="pt-2 border-t border-[#E2D7C3]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#6E685C] mb-2">
                    Signature Flavours
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Peri Peri", "Mac & Cheese", "Sweet Chilli", "Pudina", "Salt & Pepper"].map((f) => (
                      <Link
                        key={f}
                        href="/products"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white border border-[#E2D7C3] text-[#292820] hover:border-[#B85C38]"
                      >
                        {f}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Mobile Auth actions */}
                {!isAuthenticated ? (
                  <div className="pt-3 border-t border-[#E2D7C3] flex flex-col gap-2">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full rounded-xl bg-[#B85C38] hover:bg-[#9A4928] text-white">
                        Sign In to Your Account
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full rounded-xl border-[#E2D7C3]">
                        Create Account
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-[#E2D7C3] flex items-center justify-between text-xs font-medium">
                    <span className="text-[#6E685C]">Logged in as {user?.name}</span>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="text-destructive font-semibold"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
