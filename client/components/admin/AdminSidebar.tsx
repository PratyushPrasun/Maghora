"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  Boxes,
  ShoppingBag,
  FileText,
  Users,
  Ticket,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout, isSuperAdmin } = useAuth();

  const navigation = [
    { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: Layers },
    { name: "Inventory", href: "/admin/inventory", icon: Boxes },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Invoices", href: "/admin/invoices", icon: FileText },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Coupons", href: "/admin/coupons", icon: Ticket },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#142C1E] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-[#234D35] lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="h-16 flex items-center justify-between px-6 border-b border-[#234D35]">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="relative h-9 w-28 brightness-0 invert">
                <Image src="/Magnora.png" alt="Maghora Admin" fill className="object-contain object-left" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-accent/20 text-accent px-2 py-0.5 rounded-full border border-accent/30">
                Admin
              </span>
            </Link>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
            {navigation.map((item) => {
              const isActive =
                item.href === "/admin/dashboard"
                  ? pathname === "/admin/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-accent text-white shadow-sm"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer / User Info */}
        <div className="p-4 border-t border-[#234D35] bg-[#0E1F15]/80 space-y-3">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-xs text-white/70 hover:text-accent font-medium transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Customer Store</span>
            </Link>

            {isSuperAdmin && (
              <span className="text-[10px] bg-primary-light text-white/90 px-2 py-0.5 rounded-full font-bold">
                Super Admin
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#234D35]/60">
            <div className="min-w-0 pr-2">
              <p className="text-xs font-bold text-white truncate">{user?.name || "Administrator"}</p>
              <p className="text-[10px] text-white/60 truncate">{user?.email}</p>
            </div>

            <button
              onClick={() => logout()}
              className="p-1.5 rounded-lg text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

