import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 bg-background">
      <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center text-accent mb-6">
        <Sparkles className="h-8 w-8" />
      </div>
      <h1 className="text-4xl font-extrabold font-serif text-foreground mb-2">404 - Flavour Not Found</h1>
      <p className="text-sm text-muted-foreground max-w-md mb-8">
        We couldn&apos;t find the page you are looking for. It may have been moved, renamed, or is currently out of stock.
      </p>
      <Link href="/">
        <Button className="rounded-xl gap-2 font-bold px-6">
          <ArrowLeft className="h-4 w-4" /> Return to Storefront
        </Button>
      </Link>
    </div>
  );
}

