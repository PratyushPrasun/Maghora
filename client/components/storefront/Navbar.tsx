"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  LogOut,
  Package,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useCartStore } from "@/stores/useCartStore";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const { openCart } = useCartStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalCartCount = cart?.itemCount || 0;

  const scrollToSection = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      window.history.pushState(null, "", `#${targetId}`);
    }
  };

  const handleNavClick = (e: React.MouseEvent, type: "home" | "shop" | "story" | "contact") => {
    setMobileMenuOpen(false);

    if (type === "home") {
      if (pathname === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", "/");
      }
      return;
    }

    if (type === "shop") {
      e.preventDefault();
      if (pathname === "/") {
        scrollToSection("products");
      } else {
        router.push("/#products");
      }
      return;
    }

    if (type === "story") {
      e.preventDefault();
      if (pathname === "/") {
        scrollToSection("story");
      } else {
        router.push("/#story");
      }
      return;
    }

    // contact route handled normally by Link
  };

  return (
    <>
      {/* Minimal Announcement bar */}
      <div className="bg-[#244C38] text-[#F7F0E3] text-center py-2 text-[11px] sm:text-xs font-medium tracking-wider select-none border-b border-[#C49A50]/20">
        Roasted in Pure Olive Oil <span className="mx-2 text-[#C49A50]">·</span> GI-Origin Mithila Makhana <span className="mx-2 text-[#C49A50]">·</span> Free Shipping Above ₹499
      </div>

      {/* Sticky Main Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-[#F7F0E3]/95 backdrop-blur-md shadow-[0_4px_20px_rgba(41,40,32,0.06)] border-b border-[#E2D7C3]/80 py-3"
            : "bg-[#F7F0E3] border-b border-[#E2D7C3]/60 py-4"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo & Name */}
          <Link
            href="/"
            onClick={(e) => handleNavClick(e, "home")}
            className="flex items-center gap-2.5 group shrink-0"
          >
            <div className="relative h-9 w-9 sm:h-10 sm:w-10 shrink-0 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/Magnora.png"
                alt="Maghora"
                fill
                priority
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl font-extrabold tracking-[0.18em] text-[#292820] transition-colors group-hover:text-[#B85C38] leading-none">
                MAGHORA
              </span>
              <span className="text-[9px] font-semibold tracking-[0.24em] text-[#C49A50] uppercase mt-0.5">
                Mithila Flavours
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Exactly 4 Primary Links */}
          <nav className="hidden md:flex items-center gap-9 lg:gap-11">
            {/* 1. Home */}
            <Link
              href="/"
              onClick={(e) => handleNavClick(e, "home")}
              className={`text-[13px] font-semibold tracking-wider uppercase transition-colors duration-200 ${
                pathname === "/"
                  ? "text-[#B85C38]"
                  : "text-[#292820]/75 hover:text-[#B85C38]"
              }`}
            >
              Home
            </Link>

            {/* 2. Shop -> Scrolls to #products */}
            <Link
              href="/#products"
              onClick={(e) => handleNavClick(e, "shop")}
              className="text-[13px] font-semibold tracking-wider uppercase text-[#292820]/75 hover:text-[#B85C38] transition-colors duration-200 cursor-pointer"
            >
              Shop
            </Link>

            {/* 3. Our Story -> Scrolls to #story */}
            <Link
              href="/#story"
              onClick={(e) => handleNavClick(e, "story")}
              className="text-[13px] font-semibold tracking-wider uppercase text-[#292820]/75 hover:text-[#B85C38] transition-colors duration-200 cursor-pointer"
            >
              Our Story
            </Link>

            {/* 4. Contact */}
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-[13px] font-semibold tracking-wider uppercase transition-colors duration-200 ${
                pathname === "/contact"
                  ? "text-[#B85C38]"
                  : "text-[#292820]/75 hover:text-[#B85C38]"
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Header Actions: Account & Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Shopping Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2.5 text-[#292820]/80 hover:text-[#B85C38] transition-colors rounded-full hover:bg-[#ECE3D0]/60 cursor-pointer"
              aria-label={`Shopping cart with ${totalCartCount} items`}
            >
              <ShoppingBag className="h-5 w-5" />
              {totalCartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#B85C38] text-[9px] font-bold text-white shadow-xs">
                  {totalCartCount > 9 ? "9+" : totalCartCount}
                </span>
              )}
            </button>

            {/* User Account / Sign In */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-full hover:bg-[#ECE3D0]/60 transition-colors cursor-pointer"
                  aria-label="User account menu"
                >
                  <div className="h-8 w-8 rounded-full bg-[#244C38] text-[#F7F0E3] flex items-center justify-center text-xs font-bold shadow-xs">
                    {user?.name?.charAt(0).toUpperCase() || "M"}
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-[#292820]/60 hidden sm:block" />
                </button>

                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#E2D7C3] bg-white p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-2.5 border-b border-[#E2D7C3]/60 mb-1">
                        <p className="text-xs font-bold text-[#292820] truncate">
                          {user?.name}
                        </p>
                        <p className="text-[11px] text-[#292820]/55 truncate">
                          {user?.email}
                        </p>
                      </div>

                      <Link
                        href="/account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#292820] hover:bg-[#F7F0E3] rounded-xl transition-colors"
                      >
                        <UserIcon className="h-3.5 w-3.5 text-[#244C38]" /> My Profile
                      </Link>

                      <Link
                        href="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#292820] hover:bg-[#F7F0E3] rounded-xl transition-colors"
                      >
                        <Package className="h-3.5 w-3.5 text-[#244C38]" /> My Orders
                      </Link>

                      {isAdmin && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#244C38] hover:bg-[#F7F0E3] rounded-xl transition-colors"
                        >
                          <ShieldCheck className="h-3.5 w-3.5" /> Admin Portal
                        </Link>
                      )}

                      <div className="border-t border-[#E2D7C3]/60 mt-1 pt-1">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer text-left"
                        >
                          <LogOut className="h-3.5 w-3.5" /> Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/login" className="hidden sm:block">
                <Button
                  size="sm"
                  className="h-9 rounded-full bg-[#244C38] hover:bg-[#1A3728] text-[#F7F0E3] text-xs font-semibold px-4 cursor-pointer"
                >
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#292820] hover:text-[#B85C38] cursor-pointer"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="md:hidden border-t border-[#E2D7C3]/70 bg-[#F7F0E3] overflow-hidden shadow-lg"
            >
              <div className="px-5 py-6 space-y-3">
                {/* 1. Home */}
                <Link
                  href="/"
                  onClick={(e) => handleNavClick(e, "home")}
                  className={`block py-2 text-sm font-semibold tracking-wider uppercase transition-colors ${
                    pathname === "/" ? "text-[#B85C38]" : "text-[#292820]"
                  }`}
                >
                  Home
                </Link>

                {/* 2. Shop */}
                <Link
                  href="/#products"
                  onClick={(e) => handleNavClick(e, "shop")}
                  className="block py-2 text-sm font-semibold tracking-wider uppercase text-[#292820] hover:text-[#B85C38] transition-colors cursor-pointer"
                >
                  Shop
                </Link>

                {/* 3. Our Story */}
                <Link
                  href="/#story"
                  onClick={(e) => handleNavClick(e, "story")}
                  className="block py-2 text-sm font-semibold tracking-wider uppercase text-[#292820] hover:text-[#B85C38] transition-colors cursor-pointer"
                >
                  Our Story
                </Link>

                {/* 4. Contact */}
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 text-sm font-semibold tracking-wider uppercase transition-colors ${
                    pathname === "/contact" ? "text-[#B85C38]" : "text-[#292820]"
                  }`}
                >
                  Contact
                </Link>

                {!isAuthenticated && (
                  <div className="pt-4 border-t border-[#E2D7C3]/70 space-y-2.5">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full h-10 rounded-xl bg-[#244C38] text-white text-xs font-semibold uppercase tracking-wider">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full h-10 rounded-xl text-xs font-semibold uppercase tracking-wider border-[#E2D7C3]"
                      >
                        Create Account
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
