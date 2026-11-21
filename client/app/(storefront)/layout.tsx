import React from "react";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { FloatingActions } from "@/components/storefront/FloatingActions";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-[#702C32]/15 selection:text-[#702C32]">
      <Navbar />
      <main className="flex-1">{children}</main>
      <CartDrawer />
      <Footer />
      <FloatingActions />
    </div>
  );
}
