import React from "react";
import { Star, Quote } from "lucide-react";

export function Testimonials() {
  const reviews = [
    {
      name: "Ananya Deshmukh",
      role: "Yoga Instructor, Mumbai",
      quote:
        "Finally a snack that isn't soaked in palm oil! Maghora's roasted flavour is so light and airy yet bursting with authentic spices. The Himalayan Salt flavour is a daily staple for me.",
      rating: 5,
    },
    {
      name: "Rohit Malhotra",
      role: "Software Architect, Bengaluru",
      quote:
        "I used to reach for potato chips during evening code sprints. Maghora has replaced that completely. I feel sharp and light with zero post-snack lethargy.",
      rating: 5,
    },
    {
      name: "Pooja Singhania",
      role: "Nutritionist & Mother, Delhi",
      quote:
        "My kids love the crunch, and I love that it’s roasted in pure olive oil with zero artificial preservatives. The Grade-A quality of the makhana is immediately apparent.",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#FAF6EE] border-t border-border/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-accent">
            Customer Love
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold font-serif text-foreground">
            Loved By Over 15,000+ Snackers
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Hear from our community of health-conscious food lovers across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-card border border-border/80 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex text-amber-500">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-foreground/90 italic leading-relaxed">
                  &ldquo;{r.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-border/60">
                <p className="text-sm font-bold text-foreground">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

