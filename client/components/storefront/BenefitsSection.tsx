import React from "react";
import { Zap, Heart, Shield, Activity, Flame, Award } from "lucide-react";

export function BenefitsSection() {
  const benefits = [
    {
      icon: <Flame className="h-6 w-6 text-accent" />,
      title: "16x Less Fat Than Chips",
      desc: "Slow roasted in cold-pressed olive oil, giving you that irresistible savory crunch without grease.",
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "High Plant-Based Protein",
      desc: "Naturally loaded with clean amino acids to power your midday focus, workout recovery, and kids' lunchboxes.",
    },
    {
      icon: <Activity className="h-6 w-6 text-accent" />,
      title: "Low Glycemic Index",
      desc: "Slow-burning complex carbohydrates that keep blood sugar stable and prevent late-afternoon energy crashes.",
    },
    {
      icon: <Heart className="h-6 w-6 text-primary" />,
      title: "Heart-Healthy Magnesium",
      desc: "Packed with potassium and magnesium to support cardiovascular rhythm and natural relaxation.",
    },
    {
      icon: <Shield className="h-6 w-6 text-accent" />,
      title: "Naturally Gluten-Free",
      desc: "Gentle on digestion and gut-friendly. Free from wheat, soy additives, and harsh preservatives.",
    },
    {
      icon: <Award className="h-6 w-6 text-primary" />,
      title: "Antioxidant Superfood",
      desc: "Rich in flavonoids like kaempferol that help combat cellular stress and support healthy skin.",
    },
  ];

  return (
    <section id="benefits" className="py-20 sm:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent mb-2">
            Why Foxnuts (Makhana)?
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-foreground">
            The Ancient Superfood Made For Modern Living
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Every bite is packed with pure, clean nutritional density that keeps you energized, light, and focused.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((b, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card hover:border-primary/40 hover:shadow-md transition-all space-y-3"
            >
              <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                {b.icon}
              </div>
              <h3 className="text-lg font-bold text-foreground font-serif">{b.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

