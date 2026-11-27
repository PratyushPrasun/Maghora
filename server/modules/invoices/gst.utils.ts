export const INDIAN_STATE_CODES: Record<string, string> = {
  "jammu and kashmir": "01",
  "jammu & kashmir": "01",
  "himachal pradesh": "02",
  "punjab": "03",
  "chandigarh": "04",
  "uttarakhand": "05",
  "uttaranchal": "05",
  "haryana": "06",
  "delhi": "07",
  "nct of delhi": "07",
  "new delhi": "07",
  "rajasthan": "08",
  "uttar pradesh": "09",
  "bihar": "10",
  "sikkim": "11",
  "arunachal pradesh": "12",
  "nagaland": "13",
  "manipur": "14",
  "mizoram": "15",
  "tripura": "16",
  "meghalaya": "17",
  "assam": "18",
  "west bengal": "19",
  "jharkhand": "20",
  "odisha": "21",
  "orissa": "21",
  "chhattisgarh": "22",
  "chattisgarh": "22",
  "madhya pradesh": "23",
  "gujarat": "24",
  "dadra and nagar haveli and daman and diu": "26",
  "daman and diu": "26",
  "dadra and nagar haveli": "26",
  "maharashtra": "27",
  "andhra pradesh": "37",
  "karnataka": "29",
  "goa": "30",
  "lakshadweep": "31",
  "kerala": "32",
  "tamil nadu": "33",
  "tamilnadu": "33",
  "puducherry": "34",
  "pondicherry": "34",
  "andaman and nicobar islands": "35",
  "andaman & nicobar islands": "35",
  "telangana": "36",
  "ladakh": "38",
};

/**
 * Returns Indian financial year string (e.g. "26-27") in IST (Asia/Kolkata).
 * Financial year runs April 1 to March 31.
 */
export function getIndianFinancialYear(date: Date = new Date()): string {
  const istMs = date.getTime() + 5.5 * 60 * 60 * 1000;
  const ist = new Date(istMs);
  const year = ist.getUTCFullYear();
  const month = ist.getUTCMonth() + 1; // 1..12

  const startYear = month >= 4 ? year : year - 1;
  const endYear = startYear + 1;

  const yy1 = String(startYear).slice(-2);
  const yy2 = String(endYear).slice(-2);
  return `${yy1}-${yy2}`;
}

/**
 * Resolves 2-digit GST state code from an Indian state name or GSTIN prefix.
 */
export function resolveStateCode(
  stateName?: string | null,
  fallbackGstin?: string | null
): string {
  const normalized = (stateName || "").trim().toLowerCase().replace(/\s+/g, " ");
  if (/^\d{2}$/.test(normalized)) {
    return normalized;
  }
  if (normalized && INDIAN_STATE_CODES[normalized]) {
    return INDIAN_STATE_CODES[normalized];
  }
  const gstin = (fallbackGstin || "").trim();
  if (/^\d{2}/.test(gstin)) {
    return gstin.slice(0, 2);
  }
  return "";
}

/**
 * Formats integer paise as Indian Rupees with ₹ symbol and en-IN grouping.
 */
export function formatPaiseToInr(paise: number): string {
  const rupees = paise / 100;
  return `₹${rupees.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const TENS = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

function twoDigitsToWords(n: number): string {
  if (n === 0) return "";
  if (n < 20) return ONES[n];
  const ten = Math.floor(n / 10);
  const one = n % 10;
  return one ? `${TENS[ten]}-${ONES[one]}` : TENS[ten];
}

function integerToIndianWords(num: number): string {
  if (num === 0) return "Zero";

  const parts: string[] = [];
  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const hundred = Math.floor((num % 1000) / 100);
  const rest = num % 100;

  if (crore > 0) parts.push(`${integerToIndianWords(crore)} Crore`);
  if (lakh > 0) parts.push(`${twoDigitsToWords(lakh)} Lakh`);
  if (thousand > 0) parts.push(`${twoDigitsToWords(thousand)} Thousand`);
  if (hundred > 0) parts.push(`${ONES[hundred]} Hundred`);
  if (rest > 0) parts.push(twoDigitsToWords(rest));

  return parts.join(" ");
}

/**
 * Converts integer paise into Indian currency words.
 */
export function amountInWordsINR(paise: number): string {
  const safePaise = Math.max(0, Math.round(paise));
  const rupees = Math.floor(safePaise / 100);
  const remainingPaise = safePaise % 100;

  const rupeeWords = `Rupees ${integerToIndianWords(rupees)}`;
  if (remainingPaise === 0) {
    return `${rupeeWords} Only`;
  }
  return `${rupeeWords} and ${twoDigitsToWords(remainingPaise)} Paise Only`;
}

export interface GstCalculationLineInput {
  productId: string;
  variantId: string;
  productName: string;
  flavour?: string;
  sku: string;
  hsnCode?: string;
  weightGrams: number;
  quantity: number;
  unit?: string;
  mrpPaise: number;
  unitPricePaise: number;
  lineTotalPaise: number;
  gstRate?: number;
}

export interface GstCalculationInput {
  items: GstCalculationLineInput[];
  couponDiscountPaise?: number;
  shippingChargesPaise?: number;
  otherChargesPaise?: number;
  isGstRegistered: boolean;
  sellerState: string;
  sellerStateCode: string;
  sellerGstin?: string;
  customerState: string;
  customerGstin?: string;
  defaultHsnCode: string;
  defaultGstRate: number;
  shippingGstRate: number;
  pricesIncludeGst: boolean;
}

export interface CalculatedInvoiceLine {
  sNo: number;
  productId: string;
  variantId: string;
  productName: string;
  flavour: string;
  sku: string;
  hsnCode: string;
  weightGrams: number;
  quantity: number;
  unit: string;
  mrpPaise: number;
  unitPricePaise: number;
  discountPaise: number;
  taxableValuePaise: number;
  gstRate: number;
  cgstPaise: number;
  sgstPaise: number;
  igstPaise: number;
  gstAmountPaise: number;
  totalPaise: number;
}

export interface CalculatedInvoiceFinancials {
  invoiceType: "Tax Invoice" | "Bill of Supply";
  isInterstate: boolean;
  sellerStateCode: string;
  customerStateCode: string;
  items: CalculatedInvoiceLine[];
  subtotalPaise: number;
  productDiscountPaise: number;
  couponDiscountPaise: number;
  discountsPaise: number;
  shippingChargesPaise: number;
  shippingTaxablePaise: number;
  shippingGstRate: number;
  shippingGstPaise: number;
  otherChargesPaise: number;
  taxableAmountPaise: number;
  taxBreakdown: {
    cgstPaise: number;
    sgstPaise: number;
    igstPaise: number;
    totalGstPaise: number;
  };
  grandTotalPaise: number;
  amountInWords: string;
}

/**
 * Splits total GST paise into CGST/SGST (intra-state) or IGST (interstate)
 * ensuring cgst + sgst + igst === gstAmountPaise with zero rounding drift.
 */
function splitTaxPaise(
  gstAmountPaise: number,
  isGstRegistered: boolean,
  isInterstate: boolean
): { cgstPaise: number; sgstPaise: number; igstPaise: number } {
  if (!isGstRegistered || gstAmountPaise <= 0) {
    return { cgstPaise: 0, sgstPaise: 0, igstPaise: 0 };
  }
  if (isInterstate) {
    return { cgstPaise: 0, sgstPaise: 0, igstPaise: gstAmountPaise };
  }
  const cgstPaise = Math.round(gstAmountPaise / 2);
  const sgstPaise = gstAmountPaise - cgstPaise;
  return { cgstPaise, sgstPaise, igstPaise: 0 };
}

/**
 * Deterministic, paise-exact GST and invoice financial calculator.
 * Guarantees zero rounding discrepancy between line items and invoice totals.
 */
export function calculateInvoiceFinancials(
  input: GstCalculationInput
): CalculatedInvoiceFinancials {
  const sellerStateCode =
    resolveStateCode(input.sellerStateCode || input.sellerState, input.sellerGstin) ||
    "10";
  const customerStateCode = resolveStateCode(
    input.customerState,
    input.customerGstin
  );

  const isGstRegistered = Boolean(input.isGstRegistered && input.sellerGstin?.trim());
  const invoiceType: "Tax Invoice" | "Bill of Supply" = isGstRegistered
    ? "Tax Invoice"
    : "Bill of Supply";

  // If customer state code cannot be resolved, compare normalized state names.
  const isInterstate =
    customerStateCode && sellerStateCode
      ? sellerStateCode !== customerStateCode
      : input.sellerState.trim().toLowerCase() !==
        input.customerState.trim().toLowerCase();

  const rawLineSumPaise = input.items.reduce(
    (sum, item) => sum + item.lineTotalPaise,
    0
  );
  const couponDiscountPaise = Math.max(
    0,
    Math.min(Math.round(input.couponDiscountPaise || 0), rawLineSumPaise)
  );

  // Allocate coupon discount proportionally across line items with exact remainder on last item.
  let remainingCoupon = couponDiscountPaise;
  const allocatedCoupons = input.items.map((item, idx) => {
    if (couponDiscountPaise === 0 || rawLineSumPaise === 0) return 0;
    if (idx === input.items.length - 1) return remainingCoupon;
    const share = Math.round(
      (item.lineTotalPaise / rawLineSumPaise) * couponDiscountPaise
    );
    const bounded = Math.min(share, remainingCoupon);
    remainingCoupon -= bounded;
    return bounded;
  });

  let subtotalPaise = 0;
  let productDiscountPaise = 0;
  let totalTaxableItemsPaise = 0;
  let totalCgstPaise = 0;
  let totalSgstPaise = 0;
  let totalIgstPaise = 0;
  let totalGstItemsPaise = 0;
  let itemsGrandTotalPaise = 0;

  const calculatedItems: CalculatedInvoiceLine[] = input.items.map((item, idx) => {
    const qty = Math.max(1, item.quantity);
    const mrpLine = Math.max(item.mrpPaise, item.unitPricePaise) * qty;
    const sellingLine = item.lineTotalPaise;
    const itemProductDiscount = Math.max(0, mrpLine - sellingLine);
    const itemCouponDiscount = allocatedCoupons[idx] || 0;
    const totalLineDiscount = itemProductDiscount + itemCouponDiscount;

    subtotalPaise += item.unitPricePaise * qty;
    productDiscountPaise += itemProductDiscount;

    const effectiveGstRate = isGstRegistered
      ? item.gstRate !== undefined && item.gstRate !== null
        ? item.gstRate
        : input.defaultGstRate
      : 0;

    const netLineAmount = Math.max(0, sellingLine - itemCouponDiscount);

    let taxableValuePaise: number;
    let gstAmountPaise: number;
    let totalPaise: number;

    if (!isGstRegistered || effectiveGstRate === 0) {
      taxableValuePaise = netLineAmount;
      gstAmountPaise = 0;
      totalPaise = netLineAmount;
    } else if (input.pricesIncludeGst) {
      totalPaise = netLineAmount;
      taxableValuePaise = Math.round(
        (netLineAmount * 100) / (100 + effectiveGstRate)
      );
      gstAmountPaise = totalPaise - taxableValuePaise;
    } else {
      taxableValuePaise = netLineAmount;
      gstAmountPaise = Math.round((netLineAmount * effectiveGstRate) / 100);
      totalPaise = taxableValuePaise + gstAmountPaise;
    }

    const { cgstPaise, sgstPaise, igstPaise } = splitTaxPaise(
      gstAmountPaise,
      isGstRegistered,
      isInterstate
    );

    totalTaxableItemsPaise += taxableValuePaise;
    totalCgstPaise += cgstPaise;
    totalSgstPaise += sgstPaise;
    totalIgstPaise += igstPaise;
    totalGstItemsPaise += gstAmountPaise;
    itemsGrandTotalPaise += totalPaise;

    return {
      sNo: idx + 1,
      productId: item.productId,
      variantId: item.variantId,
      productName: item.productName,
      flavour: item.flavour || "",
      sku: item.sku,
      hsnCode: (item.hsnCode || input.defaultHsnCode || "").trim(),
      weightGrams: item.weightGrams,
      quantity: qty,
      unit: item.unit || "Packet",
      mrpPaise: item.mrpPaise,
      unitPricePaise: item.unitPricePaise,
      discountPaise: totalLineDiscount,
      taxableValuePaise,
      gstRate: effectiveGstRate,
      cgstPaise,
      sgstPaise,
      igstPaise,
      gstAmountPaise,
      totalPaise,
    };
  });

  const shippingChargesPaise = Math.max(0, Math.round(input.shippingChargesPaise || 0));
  const otherChargesPaise = Math.max(0, Math.round(input.otherChargesPaise || 0));
  const shippingGstRate = isGstRegistered ? Math.max(0, input.shippingGstRate) : 0;

  let shippingTaxablePaise = shippingChargesPaise;
  let shippingGstPaise = 0;
  let shippingTotalPaise = shippingChargesPaise;

  if (shippingChargesPaise > 0 && isGstRegistered && shippingGstRate > 0) {
    if (input.pricesIncludeGst) {
      shippingTotalPaise = shippingChargesPaise;
      shippingTaxablePaise = Math.round(
        (shippingChargesPaise * 100) / (100 + shippingGstRate)
      );
      shippingGstPaise = shippingTotalPaise - shippingTaxablePaise;
    } else {
      shippingTaxablePaise = shippingChargesPaise;
      shippingGstPaise = Math.round((shippingChargesPaise * shippingGstRate) / 100);
      shippingTotalPaise = shippingTaxablePaise + shippingGstPaise;
    }
  }

  const shippingTaxSplit = splitTaxPaise(
    shippingGstPaise,
    isGstRegistered,
    isInterstate
  );

  const taxableAmountPaise = totalTaxableItemsPaise + shippingTaxablePaise;
  const cgstPaise = totalCgstPaise + shippingTaxSplit.cgstPaise;
  const sgstPaise = totalSgstPaise + shippingTaxSplit.sgstPaise;
  const igstPaise = totalIgstPaise + shippingTaxSplit.igstPaise;
  const totalGstPaise = totalGstItemsPaise + shippingGstPaise;

  const grandTotalPaise =
    itemsGrandTotalPaise + shippingTotalPaise + otherChargesPaise;

  return {
    invoiceType,
    isInterstate,
    sellerStateCode,
    customerStateCode,
    items: calculatedItems,
    subtotalPaise,
    productDiscountPaise,
    couponDiscountPaise,
    discountsPaise: productDiscountPaise + couponDiscountPaise,
    shippingChargesPaise: shippingTotalPaise,
    shippingTaxablePaise,
    shippingGstRate,
    shippingGstPaise,
    otherChargesPaise,
    taxableAmountPaise,
    taxBreakdown: {
      cgstPaise,
      sgstPaise,
      igstPaise,
      totalGstPaise,
    },
    grandTotalPaise,
    amountInWords: amountInWordsINR(grandTotalPaise),
  };
}
