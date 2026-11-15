"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  Search,
  LogOut,
  Package,
  MapPin,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useCartStore } from "@/stores/useCartStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const { openCart } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { name: "Flavours", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "Our Story", href: "/#story" },
    { name: "Why Makhana", href: "/#benefits" },
  ];

  const totalCartCount = cart?.itemCount || 0;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-md transition-all">
        {/* Top Announcement Bar */}
        <div className="bg-primary px-4 py-1.5 text-center text-xs font-medium text-primary-foreground">
          <span>✨ 100% Roasted in Pure Olive Oil • Free Shipping on all orders above ₹499!</span>
        </div>

        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative h-11 w-32 sm:w-36 transition-transform group-hover:scale-[1.02]">
              <Image
                src="/Magnora.png"
                alt="Maghora Flavoured Makhana"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-accent ${
                    isActive ? "text-primary font-semibold" : "text-foreground/80"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Link */}
            <Link
              href="/products"
              className="p-2 text-foreground/80 hover:text-primary transition-colors rounded-full hover:bg-muted"
              title="Search Flavours"
            >
              <Search className="h-5 w-5" />
            </Link>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2 text-foreground/80 hover:text-primary transition-colors rounded-full hover:bg-muted cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white shadow-sm animate-scale-in">
                  {totalCartCount > 9 ? "9+" : totalCartCount}
                </span>
              )}
            </button>

            {/* User Account / Auth */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full border border-border bg-card hover:bg-muted transition-colors text-sm font-medium cursor-pointer"
                >
                  <span className="max-w-[100px] truncate text-xs font-semibold text-foreground hidden sm:inline">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className="h-3 w-3 text-muted-foreground mr-1" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-card p-2 shadow-xl z-50 animate-in fade-in-50 zoom-in-95">
                      <div className="px-3 py-2 border-b border-border/60">
                        <p className="text-xs font-bold text-foreground truncate">{user?.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/account"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground hover:bg-muted rounded-xl transition-colors"
                        >
                          <UserIcon className="h-4 w-4 text-primary" />
                          My Profile
                        </Link>

                        <Link
                          href="/orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground hover:bg-muted rounded-xl transition-colors"
                        >
                          <Package className="h-4 w-4 text-primary" />
                          My Orders
                        </Link>

                        {isAdmin && (
                          <Link
                            href="/admin/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-accent hover:bg-accent/10 rounded-xl transition-colors"
                          >
                            <ShieldCheck className="h-4 w-4" />
                            Admin Console
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-border/60 pt-1">
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
                <Button size="sm" variant="outline" className="hidden sm:inline-flex rounded-full">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-foreground rounded-lg hover:bg-muted cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 pt-4 pb-6 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-base font-medium text-foreground hover:text-accent"
              >
                {link.name}
              </Link>
            ))}

            {!isAuthenticated && (
              <div className="pt-4 border-t border-border flex flex-col gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Sign In</Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Create Account
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}

