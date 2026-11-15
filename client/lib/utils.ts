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
  }).format(date);
}

