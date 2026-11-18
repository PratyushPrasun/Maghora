"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function WaveTransition() {
  return (
    <div className="relative bg-[#F7F0E3]">
      {/* SVG Wave — cream flowing into forest green */}
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="block w-full h-[50px] sm:h-[70px] lg:h-[90px]"
      >
        <path
          d="M0,0 L0,40 Q180,100 360,60 Q540,20 720,55 Q900,90 1080,50 Q1260,10 1440,45 L1440,0 Z"
          fill="#F7F0E3"
        />
        <path
          d="M0,40 Q180,100 360,60 Q540,20 720,55 Q900,90 1080,50 Q1260,10 1440,45 L1440,120 L0,120 Z"
          fill="#244C38"
        />
      </svg>

      {/* Animated scroll indicator */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-2 sm:bottom-3">
        <a
          href="#featured-products"
          aria-label="Scroll to featured products"
          className="inline-block p-1 text-[#F7F0E3]/70 hover:text-[#F7F0E3] transition-colors cursor-pointer"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </a>
      </div>
    </div>
  );
}
