"use client";

import React from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { MithilaLotus } from "./MithilaMotifs";

interface Marketplace {
  name: string;
  badge: string;
  url: string;
  accent: string;
  logo: React.ReactNode;
}

const MARKETPLACES: Marketplace[] = [
  {
    name: "Amazon India",
    badge: "Official Storefront",
    url: "https://www.amazon.in/Maghora-Roasted-Makhana-Cholesterol-Free-Gluten-Free/dp/B0HND1F4W2/ref=sr_1_3?dib=eyJ2IjoiMSJ9.QVXHJmXhNM0WuM0FueYMKk1xvPlzDFGBLHMJHYSFcgr94yqzO1Toih9m9i_ds7O5isbm3TPcnvSt-IELmYtRMpJyJ12RqjGXvUjE3XZdQR78Nch-3QEbnz-QVTIbW2rIhWTeLE7kH8-n9wo5k1XfHx8-bFaPEotLcQjKh0FZomT2mSj_8QxfmKYqAObBgOcB.D9gpJUNwuq2sP1A2Smkm0Ee5g0yLtIEPHyCl9YAwGOs&dib_tag=se&keywords=MAGHORA&qid=1795232924&sr=8-3&th=1",
    accent: "#FF9900",
    logo: (
      <Image
        src="/amazon.svg"
        alt="Amazon India"
        width={100}
        height={30}
        className="h-6 sm:h-7 w-auto object-contain"
        priority
      />
    ),
  },
  {
    name: "Flipkart",
    badge: "Verified Brand Partner",
    url: "https://www.flipkart.com/maghora-maghera-roasted-tangy-tomato-makhana-healthy-fox-nuts-snack-nut/p/itm0f47df10d84f9?pid=NDFHSYZTEVX5WHAW&lid=LSTNDFHSYZTEVX5WHAWYUQ8B9&marketplace=FLIPKART&fm=eyJ3dHAiOiJhdGxhc19wcm9kdWN0X3N1bW1hcnlfZ3JpZF9kZWZhdWx0IiwicHJwdCI6InNwIiwibWlkIjoiYWRzIn0=&ctx=eyJkZWxpdmVyZWRCeSI6IjE3OTIyOTIzNjg5NTgiLCJkaXNwbGF5UHJpY2UiOiIyNzAifQ==&_appId=CL&fbclid=PAZXh0bgNhZW0CMTEAcGRvZgJzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAaedfACy3NnKTYhppmDoI-eNnieLKJmIjznG0N2kHgEtKtVCkUFO_8m6MBgo6A_aem_1rWkoN9Lq4c5XDS0N9lQPw",
    accent: "#2874F0",
    logo: (
      <Image
        src="/flipkart.svg"
        alt="Flipkart"
        width={110}
        height={30}
        className="h-6 sm:h-7 w-auto object-contain"
        priority
      />
    ),
  },
  {
    name: "Meesho",
    badge: "Direct Marketplace",
    url: "https://www.meesho.com/s/p/ik83jl?utm_source=ws&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAcGRvZgJzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAae4oQqGG6zUgWlF_Q0Q8HeKUp5I5FRtSV5sM7U9nweCCksX4dbFcaLQALvJPg_aem_KbW1EZqBO_nMAkojFqdpJw",
    accent: "#550A46",
    logo: (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Image
          src="/meesho_logo.png"
          alt="Meesho"
          width={30}
          height={30}
          className="h-6 sm:h-7 w-6 sm:w-7 object-contain rounded-md shadow-2xs"
          priority
        />
        <span className="text-sm sm:text-base font-bold tracking-tight text-[#33251F] font-sans">
          meesho
        </span>
      </div>
    ),
  },
];

export function MarketplaceAvailability() {
  return (
    <section
      id="available-on"
      className="scroll-mt-16 sm:scroll-mt-20 bg-[#FDF9F0] py-6 sm:py-12 border-b border-[#E8D7BE]/70 relative overflow-hidden"
      aria-label="Available On Leading Marketplaces"
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-5 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEDEC4]/60 border border-[#E8D7BE] text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.24em] text-[#702C32] mb-1.5 font-serif">
            <MithilaLotus className="h-3 w-3 text-[#E8B84E]" />
            <span>Nationwide Distribution</span>
            <MithilaLotus className="h-3 w-3 text-[#E8B84E]" />
          </div>

          <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[#33251F]">
            Also Available On
          </h2>
          <p className="mt-1 text-xs text-[#33251F]/70">
            Order Maghora roasted makhana directly from your preferred marketplace.
          </p>
        </div>

        {/* Polished Capsule Composition: Horizontal list on mobile, 3-column grid on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 max-w-4xl mx-auto">
          {MARKETPLACES.map((market) => (
            <a
              key={market.name}
              href={market.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-xl sm:rounded-3xl border border-[#E8D7BE] bg-white p-3.5 sm:p-5 shadow-xs hover:shadow-md hover:border-[#702C32] transition-all duration-300 flex flex-row sm:flex-col items-center justify-between cursor-pointer hover:-translate-y-0.5"
              aria-label={`Buy Maghora on ${market.name}`}
            >
              {/* Logo Stage */}
              <div className="h-9 sm:h-10 flex items-center justify-center">
                {market.logo}
              </div>

              <div className="sm:mt-3 sm:pt-3 sm:border-t sm:border-[#E8D7BE]/60 text-center flex items-center gap-2 sm:block">
                <span className="text-[10px] font-semibold text-[#7B685F] block">
                  {market.badge}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#702C32] flex sm:hidden items-center gap-0.5">
                  <ExternalLink className="h-3 w-3" />
                </span>
              </div>

              <div className="hidden sm:flex w-full items-center justify-end mt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7B685F] group-hover:text-[#702C32] transition-colors flex items-center gap-1">
                  <span>Visit</span>
                  <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
