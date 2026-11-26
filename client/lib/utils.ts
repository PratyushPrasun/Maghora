import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format Paise to INR string
 * e.g., 24900 paise -> ₹249.00 or ₹249
 */
export function formatPrice(paise: number, showDecimals: boolean = false): string {
  if (typeof paise !== "number" || isNaN(paise)) return "₹0";
  const rupees = paise / 100;
  if (showDecimals || rupees % 1 !== 0) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(rupees);
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupees);
}

/**
 * Calculate savings percentage between MRP and selling price
 */
export function calculateDiscount(mrpPaise: number, pricePaise: number): number {
  if (!mrpPaise || !pricePaise || mrpPaise <= pricePaise) return 0;
  return Math.round(((mrpPaise - pricePaise) / mrpPaise) * 100);
}

/**
 * Format grams to human-readable string (e.g. 100g, 1kg)
 */
export function formatWeight(grams: number): string {
  if (!grams) return "";
  if (grams >= 1000) {
    return `${(grams / 1000).toFixed(grams % 1000 === 0 ? 0 : 1)} kg`;
  }
  return `${grams}g`;
}

/**
 * Format date for orders and audit history
 */
export function formatDate(dateStr: string | Date | undefined): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

/**
 * Resolves the authentic packaging image for a product.
 * Prefers product image from API, and falls back gracefully to
 * official packaging photography in /public based on flavour/slug.
 */
export function getProductPackagingImage(product?: {
  images?: Array<{ url: string; isPrimary?: boolean }>;
  slug?: string;
  name?: string;
} | null): string {
  if (!product) return "/logo.png";
  const primary = product.images?.find((img) => img.isPrimary)?.url || product.images?.[0]?.url;
  if (primary && !primary.includes("logo.png") && !primary.includes("Magnora.png")) {
    return primary;
  }
  const key = `${product.slug || ""} ${product.name || ""}`.toLowerCase();
  if (key.includes("peri")) return "/maghora_peri_peri_01.jpg";
  if (key.includes("mac") || key.includes("cheese")) return "/maghora_mac_cheese_01.jpg";
  if (key.includes("onion") || key.includes("cream")) return "/maghora_cream_onion.jpg";
  if (key.includes("sweet") || key.includes("chilli") || key.includes("jaggery")) return "/maghora_sweet_chilli_01.jpg";
  if (key.includes("salt") || key.includes("pepper")) return "/maghora_salt_pepper_01.jpg";
  if (key.includes("pudina") || key.includes("mint") || key.includes("jeera")) return "/maghora_pudina.jpg";
  if (key.includes("tomato") || key.includes("amchur")) return "/maghora_peri_peri_02.jpg";
  return primary || "/maghora_peri_peri_01.jpg";
}


