"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Menu, Search, Bell, ExternalLink, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  // Generate breadcrumb text
  const getBreadcrumb = () => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length <= 1) return "Dashboard Overview";
    return parts
      .slice(1)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" / ");
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-card px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-foreground hover:bg-muted cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:block">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Admin
          </span>
          <p className="text-sm font-bold text-foreground">{getBreadcrumb()}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick System Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>MongoDB & Redis Online</span>
        </div>

        {/* Profile Pill */}
        <div className="flex items-center gap-2 pl-3 border-l border-border">
          <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-foreground leading-none">{user?.name || "Admin"}</p>
            <p className="text-[10px] text-muted-foreground capitalize mt-0.5">{user?.role || "Staff"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

