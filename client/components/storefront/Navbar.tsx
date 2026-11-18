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
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Shop", href: "/products" },
    { name: "Collections", href: "/categories" },
    { name: "Our Story", href: "/#story" },
  ];

  const totalCartCount = cart?.itemCount || 0;

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-[#244C38] text-[#F7F0E3] text-center py-2 text-[11px] sm:text-xs font-medium tracking-wide select-none">
        Free shipping on orders above ₹499 <span className="mx-2 text-[#C49A50]">·</span> Roasted in pure olive oil
      </div>

      {/* Main header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-[#F7F0E3]/97 backdrop-blur-md shadow-[0_1px_12px_rgba(41,40,32,0.06)]"
            : "bg-[#F7F0E3]"
        }`}
      >
        <div className="mx-auto flex h-16 sm:h-[4.5rem] max-w-6xl items-center justify-between px-5 sm:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative h-9 w-9 sm:h-10 sm:w-10 shrink-0">
              <Image
                src="/Magnora.png"
                alt="Maghora"
                fill
                priority
                className="object-contain"
              />
            </div>
            <span className="font-serif text-lg sm:text-xl font-bold tracking-[0.15em] text-[#292820] transition-colors group-hover:text-[#B85C38]">
              MAGHORA
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
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
                  className={`text-[13px] font-medium tracking-wide transition-colors ${
                    isActive
                      ? "text-[#B85C38]"
                      : "text-[#292820]/70 hover:text-[#292820]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search */}
            <Link
              href="/products"
              className="p-2 text-[#292820]/60 hover:text-[#292820] transition-colors rounded-full"
              title="Search"
            >
              <Search className="h-[18px] w-[18px]" />
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative p-2 text-[#292820]/60 hover:text-[#292820] transition-colors rounded-full cursor-pointer"
              aria-label={`Cart${totalCartCount ? `, ${totalCartCount} items` : ""}`}
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {totalCartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#B85C38] text-[9px] font-bold text-white">
                  {totalCartCount > 9 ? "9+" : totalCartCount}
                </span>
              )}
            </button>

            {/* Account */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-1.5 rounded-full hover:bg-[#292820]/5 transition-colors cursor-pointer"
                >
                  <div className="h-7 w-7 rounded-full bg-[#244C38] text-[#F7F0E3] flex items-center justify-center text-[11px] font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className="h-3 w-3 text-[#292820]/40 hidden sm:block" />
                </button>

                {userDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-52 rounded-xl border border-[#E2D7C3] bg-white p-1.5 shadow-lg z-50">
                      <div className="px-3 py-2 border-b border-[#E2D7C3]/60 mb-1">
                        <p className="text-xs font-semibold text-[#292820] truncate">{user?.name}</p>
                        <p className="text-[11px] text-[#292820]/50 truncate">{user?.email}</p>
                      </div>
                      <Link href="/account" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2 px-3 py-2 text-xs text-[#292820] hover:bg-[#F7F0E3] rounded-lg transition-colors">
                        <UserIcon className="h-3.5 w-3.5 text-[#292820]/40" /> My Profile
                      </Link>
                      <Link href="/orders" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2 px-3 py-2 text-xs text-[#292820] hover:bg-[#F7F0E3] rounded-lg transition-colors">
                        <Package className="h-3.5 w-3.5 text-[#292820]/40" /> My Orders
                      </Link>
                      {isAdmin && (
                        <Link href="/admin/dashboard" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2 px-3 py-2 text-xs text-[#244C38] font-medium hover:bg-[#F7F0E3] rounded-lg transition-colors">
                          <ShieldCheck className="h-3.5 w-3.5" /> Admin
                        </Link>
                      )}
                      <div className="border-t border-[#E2D7C3]/60 mt-1 pt-1">
                        <button onClick={() => { setUserDropdownOpen(false); logout(); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer text-left">
                          <LogOut className="h-3.5 w-3.5" /> Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/login" className="hidden sm:block">
                <Button size="sm" className="h-8 rounded-full bg-[#292820] hover:bg-[#292820]/85 text-white text-xs px-4 font-medium">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#292820]/70 cursor-pointer"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-[#E2D7C3]/60 bg-[#F7F0E3] overflow-hidden"
            >
              <div className="px-5 py-5 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2.5 text-[15px] font-medium text-[#292820] hover:text-[#B85C38] transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                {!isAuthenticated && (
                  <div className="pt-4 border-t border-[#E2D7C3]/60 mt-3 space-y-2">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full h-10 rounded-xl bg-[#292820] text-white text-sm">Sign In</Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full h-10 rounded-xl text-sm border-[#E2D7C3]">Create Account</Button>
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
