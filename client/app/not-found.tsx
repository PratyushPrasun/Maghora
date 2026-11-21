import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MithilaLotus } from "@/components/storefront/MithilaMotifs";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 bg-[#F8EEDC]">
      <div className="w-16 h-16 rounded-full bg-[#EEDEC4] flex items-center justify-center text-[#702C32] mb-6 shadow-xs border border-[#E8D7BE]">
        <MithilaLotus className="h-8 w-8 text-[#702C32]" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#33251F] mb-2">
        404 — Flavour Not Found
      </h1>
      <p className="text-xs sm:text-sm text-[#7B685F] max-w-md mb-8 leading-relaxed">
        We couldn&apos;t find the page you are looking for. It may have been moved, renamed, or is currently being prepared.
      </p>
      <Link href="/">
        <Button className="rounded-xl gap-2 font-serif font-bold uppercase tracking-wider text-xs px-6 bg-[#702C32] hover:bg-[#551F24] text-[#F8EEDC] shadow-md">
          <ArrowLeft className="h-4 w-4" /> Return to Storefront
        </Button>
      </Link>
    </div>
  );
}
