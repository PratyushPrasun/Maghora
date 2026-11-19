"use client";

import { useEffect } from "react";

export function HashScrollHandler() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash) return;

      const targetId = hash.replace("#", "");
      const element = document.getElementById(targetId);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    };

    // Delay slightly to ensure DOM is mounted and hydrated
    const timeout = setTimeout(scrollToHash, 200);

    window.addEventListener("hashchange", scrollToHash);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, []);

  return null;
}
