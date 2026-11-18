"use client";

import React from "react";
import { Star, ShieldCheck, CheckCircle2, Heart } from "lucide-react";
import { MithilaLotus } from "./MithilaMotifs";

interface Testimonial {
  name: string;
  role: string;
  location: string;
  favouriteFlavour: string;
  rating: number;
  content: string;
  verified: boolean;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Ananya Roy",
    role: "Brand Director",
    location: "Bengaluru",
    favouriteFlavour: "Truffle Mac & Cheese",
    rating: 5,
    content:
      "The Mac & Cheese is an absolute revelation. You can genuinely taste the olive oil roast — ultra-crisp, light, and never greasy like typical commercial namkeens. It's permanently stocked in our pantry now.",
    verified: true,
  },
  {
    name: "Dr. Priyesh Jha",
    role: "Pediatrician",
    location: "Patna",
    favouriteFlavour: "Himalayan Salt & Pepper",
    rating: 5,
    content:
      "Having grown up in Madhubani, makhana is sacred to our family. Maghora has treated this crop with tremendous respect. The Himalayan Salt & Pepper lets the authentic quality of the foxnut shine through.",
    verified: true,
  },
  {
    name: "Shreya & Kabir Singhania",
    role: "Tech Founders",
    location: "Mumbai",
    favouriteFlavour: "Smoky Peri Peri",
    rating: 5,
    content:
      "Finally a makhana brand that doesn't taste like powdery chalk! The Peri Peri has a genuine fiery bite with citrus undertones. We ordered the 7-sampler box for Diwali and had to reorder two weeks later.",
    verified: true,
  },
  {
    name: "Kavita Narayanan",
    role: "Wellness Consultant",
    location: "New Delhi",
    favouriteFlavour: "Fresh Pudina Masala",
    rating: 5,
    content:
      "I recommend Maghora to clients seeking gluten-free, low-glycemic desk snacks. Pure olive oil roasting is so much gentler on digestion than fried palm oil snacks. Outstanding crunch.",
    verified: true,
  },
];

export function CustomerReviews() {
  return (
    <section id="reviews" className="relative bg-[#F7F0E3] py-18 sm:py-26 border-b border-[#E2D7C3] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#244C38] mb-3">
            <MithilaLotus className="h-3.5 w-3.5 text-[#C49A50]" />
            <span>Community Acclaim</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#292820] leading-tight">
            Loved Across Indian Tables.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6E685C] leading-relaxed">
            Real feedback from discerning snackers who have embraced the Maghora crunch.
          </p>
        </div>

        {/* Acclaim Statistics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
          <div className="rounded-2xl border border-[#E2D7C3] bg-white p-5 text-center shadow-xs">
            <div className="flex items-center justify-center gap-1 text-[#C49A50] mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-[#C49A50]" />
              ))}
            </div>
            <p className="font-serif text-2xl font-bold text-[#292820]">4.9 / 5.0</p>
            <p className="text-[11px] text-[#6E685C] mt-0.5">Average Customer Rating</p>
          </div>

          <div className="rounded-2xl border border-[#E2D7C3] bg-white p-5 text-center shadow-xs">
            <p className="font-serif text-2xl font-bold text-[#244C38]">10,000+</p>
            <p className="text-[11px] text-[#6E685C] mt-1">Packs Roasted & Delivered</p>
            <p className="text-[10px] text-[#C49A50] font-semibold mt-0.5">Across 45+ Cities</p>
          </div>

          <div className="rounded-2xl border border-[#E2D7C3] bg-white p-5 text-center shadow-xs">
            <p className="font-serif text-2xl font-bold text-[#B85C38]">94%</p>
            <p className="text-[11px] text-[#6E685C] mt-1">Repeat Reorder Rate</p>
            <p className="text-[10px] text-[#244C38] font-semibold mt-0.5">Pantry Staple</p>
          </div>

          <div className="rounded-2xl border border-[#E2D7C3] bg-white p-5 text-center shadow-xs">
            <p className="font-serif text-2xl font-bold text-[#292820]">100%</p>
            <p className="text-[11px] text-[#6E685C] mt-1">Olive Oil & Vegetarian</p>
            <p className="text-[10px] text-[#244C38] font-semibold mt-0.5">FSSAI Certified</p>
          </div>
        </div>

        {/* 4 Masonry-Style Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((review, i) => (
            <article
              key={i}
              className="rounded-3xl border border-[#E2D7C3] bg-white p-6 sm:p-8 flex flex-col justify-between shadow-[0_8px_30px_-15px_rgba(41,40,32,0.08)] hover:border-[#C49A50] transition-colors"
            >
              <div>
                {/* Header: Stars & Favourite Flavour badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-[#C49A50]">
                    {[...Array(review.rating)].map((_, idx) => (
                      <Star key={idx} className="h-4 w-4 fill-[#C49A50]" />
                    ))}
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#F7F0E3] text-[#B85C38] border border-[#E2D7C3]">
                    Loves {review.favouriteFlavour}
                  </span>
                </div>

                {/* Review Text */}
                <blockquote className="font-serif text-base sm:text-lg text-[#292820] leading-snug">
                  &ldquo;{review.content}&rdquo;
                </blockquote>
              </div>

              {/* Author Info */}
              <div className="mt-6 pt-4 border-t border-[#E2D7C3]/70 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#292820]">
                    {review.name}
                  </h4>
                  <p className="text-[11px] text-[#6E685C]">
                    {review.role} · {review.location}
                  </p>
                </div>

                {review.verified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#244C38]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Verified Buyer
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
