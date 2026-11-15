import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BrandStory() {
  const commitments = [
    "Grade-A Jumbo foxnuts directly harvested from the nutrient-dense water wetlands of Bihar.",
    "Gentle dry-roast and finishing in cold-pressed extra virgin olive oil.",
    "Zero palm oil, zero trans fat, zero artificial preservatives or chemical colors.",
    "Small batch seasoning to ensure crisp crunch in every single kernel.",
  ];

  return (
    <section id="story" className="py-20 sm:py-28 bg-[#F3EFE6] border-y border-border/80 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Visual Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-4/5 w-full rounded-3xl bg-primary/10 overflow-hidden border border-border shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent z-10" />
              <Image
                src="/Magnora.png"
                alt="Maghora Brand Heritage"
                fill
                className="object-contain p-8 transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-6 left-6 right-6 z-20 text-white">
                <span className="text-xs uppercase tracking-widest text-accent font-bold">The Origin</span>
                <h3 className="text-xl font-bold font-serif mt-1">From Ancient Wetlands to Modern Snacking</h3>
              </div>
            </div>

            {/* Accent badge */}
            <div className="absolute -bottom-6 -right-6 bg-card border border-border rounded-2xl p-4 shadow-xl hidden sm:block max-w-[200px]">
              <p className="text-2xl font-bold text-primary font-serif">100%</p>
              <p className="text-xs font-semibold text-foreground">Olive Oil Roasted</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Never deep fried in seed oils</p>
            </div>
          </div>

          {/* Right Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              Our Philosophy
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-foreground leading-tight">
              We started Maghora because snacks should never be a compromise.
            </h2>

            <p className="text-base text-muted-foreground leading-relaxed">
              For generations, Makhana (Euryale ferox) was celebrated in ancient Ayurvedic texts as the king of superfoods — packed with protein, vital minerals, and natural antioxidants. But modern packaged snacks turned it into a greasy, chemical-laden experience.
            </p>

            <p className="text-base text-muted-foreground leading-relaxed">
              At Maghora, we do things differently. We select only Grade-A jumbo lotus seeds, puff them to a light-as-air crunch, and toss them in cold-pressed extra virgin olive oil with honest spices. The result is pure, crunchy bliss.
            </p>

            {/* Commitments Checklist */}
            <div className="pt-2 space-y-3">
              {commitments.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-foreground">{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link href="/products">
                <Button size="lg" className="rounded-xl gap-2">
                  Taste the Difference <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

