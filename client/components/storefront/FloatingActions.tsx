"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 280) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", checkScroll, { passive: true });
    checkScroll();
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919288494099";
  const defaultMessage = encodeURIComponent(
    "Namaste Maghora! I would like to know more about your flavoured roasted makhana."
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  return (
    <div
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] right-[calc(1rem+env(safe-area-inset-right,0px))] sm:bottom-6 sm:right-6 z-40 flex flex-col items-center gap-2 sm:gap-3 pointer-events-none"
      aria-label="Quick Actions"
    >
      {/* Scroll-To-Top Button (Appears above WhatsApp, hidden on mobile view) */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            key="scroll-top-btn"
            initial={{ opacity: 0, scale: 0.7, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={scrollToTop}
            className="hidden sm:flex pointer-events-auto h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-[#702C32] hover:bg-[#551F24] text-[#F8EEDC] shadow-lg border border-[#E8B84E]/30 items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group focus-visible:outline-2 focus-visible:outline-[#E8B84E]"
            aria-label="Scroll back to top of page"
            title="Scroll to top"
          >
            <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp Button (Clean, no ping animation) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto relative h-11 w-11 sm:h-13 sm:w-13 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-[0_6px_20px_rgba(37,211,102,0.3)] sm:shadow-[0_8px_24px_rgba(37,211,102,0.35)] flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group focus-visible:outline-2 focus-visible:outline-[#25D366]"
        aria-label="Chat with Maghora on WhatsApp"
        title="Chat with us on WhatsApp"
      >
        {/* Official WhatsApp Icon */}
        <svg
          viewBox="0 0 24 24"
          className="h-5.5 w-5.5 sm:h-7 sm:w-7 fill-current relative z-10 drop-shadow-xs transition-transform duration-200 group-hover:scale-105"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>
    </div>
  );
}
