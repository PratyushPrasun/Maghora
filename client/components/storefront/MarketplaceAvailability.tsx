"use client";

import React from "react";
import { MithilaLotus } from "./MithilaMotifs";

export function MarketplaceAvailability() {
  return (
    <section
      id="available-on"
      className="bg-[#FDFBF7] py-14 sm:py-20 border-t border-[#E2D7C3]"
      aria-label="Available on Marketplaces"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F0E3] border border-[#E2D7C3] text-[11px] font-semibold uppercase tracking-[0.2em] text-[#244C38] mb-3">
            <MithilaLotus className="h-3.5 w-3.5 text-[#B85C38]" />
            <span>Pan-India Availability</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#292820]">
            Also Available On
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#292820]/65 leading-relaxed">
            Order Maghora roasted makhana directly through our official channels and India’s premier marketplace platforms.
          </p>
        </div>

        {/* Official Marketplace Logos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {/* Amazon */}
          <div className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl border border-[#E2D7C3] bg-white transition-all duration-300 hover:border-[#C49A50] hover:shadow-[0_8px_20px_rgba(41,40,32,0.05)]">
            <div className="h-10 flex items-center justify-center">
              <svg
                className="h-7 w-auto"
                viewBox="0 0 100 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Amazon"
              >
                {/* Amazon wordmark */}
                <text
                  x="0"
                  y="20"
                  fontFamily="'Arial', 'Helvetica', sans-serif"
                  fontWeight="bold"
                  fontSize="22"
                  fill="#141920"
                  letterSpacing="-0.5"
                >
                  amazon
                </text>
                {/* Amazon Smile Arrow */}
                <path
                  d="M14 24C32 30 58 29 74 20"
                  stroke="#FF9900"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
                <path
                  d="M71 18L76 20L72 23"
                  stroke="#FF9900"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-[#292820]/60">
              Official Store
            </span>
          </div>

          {/* Flipkart */}
          <div className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl border border-[#E2D7C3] bg-white transition-all duration-300 hover:border-[#C49A50] hover:shadow-[0_8px_20px_rgba(41,40,32,0.05)]">
            <div className="h-10 flex items-center justify-center">
              <svg
                className="h-8 w-auto"
                viewBox="0 0 120 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Flipkart"
              >
                {/* Flipkart bag mark */}
                <rect x="2" y="5" width="22" height="22" rx="4" fill="#2874F0" />
                <path
                  d="M10 11H17C18.1 11 19 11.9 19 13V14H12V16H18V18H12V23H10V11Z"
                  fill="#FFE11B"
                  fontStyle="italic"
                />
                {/* Flipkart wordmark */}
                <text
                  x="30"
                  y="22"
                  fontFamily="'Arial', 'Helvetica', sans-serif"
                  fontWeight="bold"
                  fontStyle="italic"
                  fontSize="20"
                  fill="#2874F0"
                >
                  Flipkart
                </text>
              </svg>
            </div>
            <span className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-[#292820]/60">
              Verified Brand Partner
            </span>
          </div>

          {/* Meesho */}
          <div className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl border border-[#E2D7C3] bg-white transition-all duration-300 hover:border-[#C49A50] hover:shadow-[0_8px_20px_rgba(41,40,32,0.05)]">
            <div className="h-10 flex items-center justify-center">
              <svg
                className="h-8 w-auto"
                viewBox="0 0 110 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Meesho"
              >
                {/* Meesho stylized M icon */}
                <circle cx="16" cy="16" r="14" fill="#9B2060" />
                <path
                  d="M10 21V12L16 18L22 12V21"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Meesho wordmark */}
                <text
                  x="36"
                  y="22"
                  fontFamily="'Arial', 'Helvetica', sans-serif"
                  fontWeight="bold"
                  fontSize="20"
                  fill="#9B2060"
                  letterSpacing="-0.5"
                >
                  meesho
                </text>
              </svg>
            </div>
            <span className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-[#292820]/60">
              Direct Marketplace
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
