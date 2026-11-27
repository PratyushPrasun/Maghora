import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import PDFDocument from "pdfkit";

import type { IInvoice } from "./invoice.model.js";
import { formatPaiseToInr } from "./gst.utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Brand Palette matching client/app/globals.css
const COLORS = {
  deepMaroon: "#702C32",
  burntOrange: "#C65D35",
  haldiGold: "#E8B84E",
  mithilaIvory: "#F8EEDC",
  ivoryLight: "#FDF9F0",
  inkBrown: "#33251F",
  mutedBrown: "#7B685F",
  border: "#E2D2B8",
  leafGreen: "#536B42",
  white: "#FFFFFF",
  tableStripe: "#FBF7F0",
};

function resolveAssetPath(relativeFromServerRoot: string): string | null {
  const candidates = [
    path.resolve(__dirname, "../../", relativeFromServerRoot),
    path.resolve(process.cwd(), relativeFromServerRoot),
    path.resolve(process.cwd(), "server", relativeFromServerRoot),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

function formatDateIST(dateInput: Date | string): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return date.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatAddressLines(addr: {
  addressLine1?: string;
  addressLine2?: string;
  landmark?: string;
  city?: string;
  state?: string;
  stateCode?: string;
  postalCode?: string;
  country?: string;
}): string[] {
  const lines: string[] = [];
  if (addr.addressLine1) lines.push(addr.addressLine1);
  if (addr.addressLine2) lines.push(addr.addressLine2);
  if (addr.landmark) lines.push(`Landmark: ${addr.landmark}`);
  const cityStatePin = [
    addr.city,
    addr.state
      ? addr.stateCode
        ? `${addr.state} (${addr.stateCode})`
        : addr.state
      : "",
    addr.postalCode,
  ]
    .filter(Boolean)
    .join(", ");
  if (cityStatePin) lines.push(cityStatePin);
  if (addr.country) lines.push(addr.country);
  return lines;
}

/**
 * Generates an A4 PDF Buffer for the given immutable Invoice snapshot.
 * Supports multi-page tables, ₹ Rupee glyph via bundled TTF fonts,
 * and mobile/desktop PDF reader compatibility.
 */
export async function generateInvoicePdfBuffer(
  invoice: IInvoice
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 32,
      bufferPages: true,
      info: {
        Title: `${invoice.invoiceType} - ${invoice.invoiceNumber}`,
        Author: invoice.sellerDetailsSnapshot.legalName,
        Subject: `Invoice for Order ${invoice.orderNumber}`,
        Creator: "Maghora Invoice Engine",
      },
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const regularFontPath = resolveAssetPath("assets/fonts/Regular.ttf");
    const boldFontPath = resolveAssetPath("assets/fonts/Bold.ttf");
    const FONT_REG = regularFontPath ? "MaghoraRegular" : "Helvetica";
    const FONT_BOLD = boldFontPath ? "MaghoraBold" : "Helvetica-Bold";

    if (regularFontPath) doc.registerFont(FONT_REG, regularFontPath);
    if (boldFontPath) doc.registerFont(FONT_BOLD, boldFontPath);

    const logoPath =
      resolveAssetPath("assets/logo.png") ||
      resolveAssetPath("assets/Magnora.png");

    const pageWidth = doc.page.width; // 595.28
    const pageHeight = doc.page.height; // 841.89
    const leftMargin = 32;
    const rightMargin = 32;
    const contentWidth = pageWidth - leftMargin - rightMargin; // 531.28

    // =========================================================================
    // 1. TOP ACCENT BAR & SELLER / INVOICE HEADER
    // =========================================================================
    doc.rect(0, 0, pageWidth, 8).fill(COLORS.deepMaroon);
    doc.rect(0, 8, pageWidth, 2.5).fill(COLORS.haldiGold);

    let y = 24;
    const headerStartY = y;

    // Left: Logo + Seller Info
    if (logoPath) {
      try {
        doc.image(logoPath, leftMargin, y, { fit: [110, 44] });
        y += 48;
      } catch {
        // Fallback to text branding if image cannot be decoded
      }
    }

    const seller = invoice.sellerDetailsSnapshot;
    doc
      .font(FONT_BOLD)
      .fontSize(14)
      .fillColor(COLORS.deepMaroon)
      .text(seller.brandName, leftMargin, y);
    y += 16;

    doc
      .font(FONT_REG)
      .fontSize(8)
      .fillColor(COLORS.burntOrange)
      .text(seller.tagline, leftMargin, y);
    y += 13;

    doc
      .font(FONT_BOLD)
      .fontSize(8.5)
      .fillColor(COLORS.inkBrown)
      .text(seller.legalName, leftMargin, y, { width: 270 });
    y += 12;

    const sellerAddrLines = formatAddressLines(seller);
    doc.font(FONT_REG).fontSize(8).fillColor(COLORS.mutedBrown);
    for (const line of sellerAddrLines) {
      doc.text(line, leftMargin, y, { width: 270 });
      y += 11;
    }

    if (seller.gstin && seller.isGstRegistered) {
      doc
        .font(FONT_BOLD)
        .fontSize(8)
        .fillColor(COLORS.inkBrown)
        .text(`GSTIN: ${seller.gstin}`, leftMargin, y);
      y += 11;
    }
    if (seller.contactNumber) {
      doc
        .font(FONT_REG)
        .fontSize(8)
        .fillColor(COLORS.mutedBrown)
        .text(`Phone: ${seller.contactNumber}`, leftMargin, y);
      y += 11;
    }
    if (seller.supportEmail) {
      doc.text(`Email: ${seller.supportEmail}`, leftMargin, y);
      y += 11;
    }
    if (seller.website) {
      doc.text(`Web: ${seller.website}`, leftMargin, y);
      y += 11;
    }

    // Right: Invoice Title & Identification Box
    const rightBoxWidth = 230;
    const rightBoxX = pageWidth - rightMargin - rightBoxWidth;
    let ry = headerStartY;

    doc
      .roundedRect(rightBoxX, ry, rightBoxWidth, 26, 4)
      .fill(COLORS.deepMaroon);
    doc
      .font(FONT_BOLD)
      .fontSize(11)
      .fillColor(COLORS.mithilaIvory)
      .text(invoice.invoiceType.toUpperCase(), rightBoxX, ry + 7, {
        width: rightBoxWidth,
        align: "center",
      });
    ry += 32;

    const metaBoxStartY = ry;
    const metaRows: Array<[string, string]> = [
      ["Invoice No:", invoice.invoiceNumber],
      ["Issue Date:", formatDateIST(invoice.issuedAt)],
      ["Financial Year:", `FY ${invoice.financialYear}`],
      ["Order ID:", invoice.orderNumber],
      ["Order Date:", formatDateIST(invoice.orderDate)],
      ["Payment Status:", invoice.paymentStatus],
      ["Payment Method:", invoice.paymentMethod],
    ];
    if (invoice.paymentReference) {
      metaRows.push(["Payment Ref:", invoice.paymentReference]);
    }

    const metaBoxHeight = metaRows.length * 14 + 14;
    doc
      .roundedRect(rightBoxX, metaBoxStartY, rightBoxWidth, metaBoxHeight, 4)
      .fillAndStroke(COLORS.ivoryLight, COLORS.border);

    ry += 8;
    for (const [label, value] of metaRows) {
      doc
        .font(FONT_REG)
        .fontSize(7.8)
        .fillColor(COLORS.mutedBrown)
        .text(label, rightBoxX + 10, ry, { width: 85 });

      const isPaid = label === "Payment Status:" && value === "Paid";
      doc
        .font(FONT_BOLD)
        .fontSize(7.8)
        .fillColor(isPaid ? COLORS.leafGreen : COLORS.inkBrown)
        .text(value, rightBoxX + 95, ry, {
          width: rightBoxWidth - 105,
          align: "right",
        });
      ry += 14;
    }

    y = Math.max(y, metaBoxStartY + metaBoxHeight) + 14;

    // Divider
    doc
      .moveTo(leftMargin, y)
      .lineTo(pageWidth - rightMargin, y)
      .strokeColor(COLORS.border)
      .lineWidth(1)
      .stroke();
    y += 12;

    // =========================================================================
    // 2. CUSTOMER INFORMATION (BILL TO / SHIP TO) & PLACE OF SUPPLY
    // =========================================================================
    const cust = invoice.customerSnapshot;
    if (invoice.sameBillingAndShipping) {
      const boxHeight = 96;
      doc
        .roundedRect(leftMargin, y, contentWidth, boxHeight, 4)
        .fillAndStroke(COLORS.ivoryLight, COLORS.border);

      doc
        .font(FONT_BOLD)
        .fontSize(8)
        .fillColor(COLORS.deepMaroon)
        .text("BILL TO & SHIP TO (IDENTICAL BILLING & DELIVERY ADDRESS)", leftMargin + 10, y + 8);

      let cy = y + 22;
      doc
        .font(FONT_BOLD)
        .fontSize(8.5)
        .fillColor(COLORS.inkBrown)
        .text(cust.fullName, leftMargin + 10, cy, { width: 250 });

      doc
        .font(FONT_REG)
        .fontSize(8)
        .fillColor(COLORS.mutedBrown)
        .text(
          `Mobile: ${cust.mobile}   |   Email: ${cust.email}`,
          leftMargin + 10,
          cy + 12,
          { width: 260 }
        );

      if (cust.customerGstin) {
        doc
          .font(FONT_BOLD)
          .fontSize(8)
          .fillColor(COLORS.inkBrown)
          .text(`Customer GSTIN: ${cust.customerGstin}`, leftMargin + 10, cy + 24);
      }

      const shipLines = formatAddressLines(invoice.shippingAddress);
      let sy = y + 22;
      const rightColX = leftMargin + 280;
      doc
        .font(FONT_BOLD)
        .fontSize(8)
        .fillColor(COLORS.inkBrown)
        .text(
          `Recipient: ${invoice.shippingAddress.recipientName} (${invoice.shippingAddress.phone})`,
          rightColX,
          sy,
          { width: 240 }
        );
      sy += 12;
      doc.font(FONT_REG).fontSize(8).fillColor(COLORS.mutedBrown);
      for (const line of shipLines) {
        doc.text(line, rightColX, sy, { width: 240 });
        sy += 10.5;
      }

      y += boxHeight + 10;
    } else {
      const colWidth = (contentWidth - 12) / 2;
      const boxHeight = 104;

      // BILL TO
      doc
        .roundedRect(leftMargin, y, colWidth, boxHeight, 4)
        .fillAndStroke(COLORS.ivoryLight, COLORS.border);
      doc
        .font(FONT_BOLD)
        .fontSize(8)
        .fillColor(COLORS.deepMaroon)
        .text("BILL TO", leftMargin + 10, y + 8);

      let by = y + 21;
      doc
        .font(FONT_BOLD)
        .fontSize(8.5)
        .fillColor(COLORS.inkBrown)
        .text(cust.fullName, leftMargin + 10, by, { width: colWidth - 20 });
      by += 11;
      doc
        .font(FONT_REG)
        .fontSize(7.8)
        .fillColor(COLORS.mutedBrown)
        .text(`Mobile: ${cust.mobile} | ${cust.email}`, leftMargin + 10, by, {
          width: colWidth - 20,
        });
      by += 11;
      if (cust.customerGstin) {
        doc
          .font(FONT_BOLD)
          .fontSize(7.8)
          .fillColor(COLORS.inkBrown)
          .text(`GSTIN: ${cust.customerGstin}`, leftMargin + 10, by);
        by += 11;
      }
      doc.font(FONT_REG).fontSize(7.8).fillColor(COLORS.mutedBrown);
      for (const line of formatAddressLines(invoice.billingAddress)) {
        doc.text(line, leftMargin + 10, by, { width: colWidth - 20 });
        by += 10;
      }

      // SHIP TO
      const shipX = leftMargin + colWidth + 12;
      doc
        .roundedRect(shipX, y, colWidth, boxHeight, 4)
        .fillAndStroke(COLORS.ivoryLight, COLORS.border);
      doc
        .font(FONT_BOLD)
        .fontSize(8)
        .fillColor(COLORS.deepMaroon)
        .text("SHIP TO", shipX + 10, y + 8);

      let sy = y + 21;
      doc
        .font(FONT_BOLD)
        .fontSize(8.5)
        .fillColor(COLORS.inkBrown)
        .text(invoice.shippingAddress.recipientName, shipX + 10, sy, {
          width: colWidth - 20,
        });
      sy += 11;
      doc
        .font(FONT_REG)
        .fontSize(7.8)
        .fillColor(COLORS.mutedBrown)
        .text(`Mobile: ${invoice.shippingAddress.phone}`, shipX + 10, sy);
      sy += 11;
      for (const line of formatAddressLines(invoice.shippingAddress)) {
        doc.text(line, shipX + 10, sy, { width: colWidth - 20 });
        sy += 10;
      }

      y += boxHeight + 10;
    }

    // Place of Supply Strip
    const posText = seller.isGstRegistered
      ? invoice.placeOfSupply.isInterstate
        ? `Place of Supply: ${invoice.placeOfSupply.state}${invoice.placeOfSupply.stateCode ? ` (${invoice.placeOfSupply.stateCode})` : ""}  |  Supply Type: Inter-State (IGST)`
        : `Place of Supply: ${invoice.placeOfSupply.state}${invoice.placeOfSupply.stateCode ? ` (${invoice.placeOfSupply.stateCode})` : ""}  |  Supply Type: Intra-State (CGST + SGST)`
      : `Place of Supply: ${invoice.placeOfSupply.state}  |  Bill of Supply (Non-GST Registered)`;

    doc
      .roundedRect(leftMargin, y, contentWidth, 20, 3)
      .fill(COLORS.mithilaIvory);
    doc
      .font(FONT_BOLD)
      .fontSize(7.8)
      .fillColor(COLORS.deepMaroon)
      .text(posText, leftMargin + 10, y + 6, { width: contentWidth - 20 });
    y += 28;

    // =========================================================================
    // 3. PRODUCT DETAILS TABLE (12 COLUMNS, MULTI-PAGE SAFE)
    // =========================================================================
    const cols = [
      { key: "sNo", label: "S.No", width: 22, align: "center" as const },
      { key: "name", label: "Product Name", width: 112, align: "left" as const },
      { key: "sku", label: "SKU", width: 48, align: "left" as const },
      { key: "hsn", label: "HSN", width: 32, align: "center" as const },
      { key: "qty", label: "Qty", width: 22, align: "center" as const },
      { key: "unit", label: "Unit", width: 32, align: "center" as const },
      { key: "rate", label: "Unit Price", width: 46, align: "right" as const },
      { key: "disc", label: "Discount", width: 42, align: "right" as const },
      { key: "taxable", label: "Taxable", width: 48, align: "right" as const },
      { key: "gstRate", label: "GST %", width: 30, align: "center" as const },
      { key: "gstAmt", label: "GST Amt", width: 44, align: "right" as const },
      { key: "total", label: "Total", width: 53, align: "right" as const },
    ]; // sum = 531

    const drawTableHeader = (topY: number): number => {
      doc.rect(leftMargin, topY, contentWidth, 22).fill(COLORS.deepMaroon);
      let cx = leftMargin;
      doc.font(FONT_BOLD).fontSize(6.8).fillColor(COLORS.white);
      for (const col of cols) {
        doc.text(col.label, cx + 2, topY + 7, {
          width: col.width - 4,
          align: col.align,
        });
        cx += col.width;
      }
      return topY + 22;
    };

    y = drawTableHeader(y);

    const footerReserveHeight = 68;
    const maxTableY = pageHeight - footerReserveHeight;

    for (let i = 0; i < invoice.items.length; i++) {
      const item = invoice.items[i];
      const displayName = item.flavour
        ? `${item.productName} (${item.flavour}) - ${item.weightGrams}g`
        : `${item.productName} - ${item.weightGrams}g`;

      doc.font(FONT_BOLD).fontSize(7.2);
      const nameHeight = doc.heightOfString(displayName, {
        width: cols[1].width - 4,
      });
      const rowHeight = Math.max(22, Math.ceil(nameHeight) + 10);

      if (y + rowHeight > maxTableY) {
        doc.addPage();
        y = 32;
        y = drawTableHeader(y);
      }

      if (i % 2 === 1) {
        doc.rect(leftMargin, y, contentWidth, rowHeight).fill(COLORS.tableStripe);
      }

      doc
        .rect(leftMargin, y, contentWidth, rowHeight)
        .strokeColor(COLORS.border)
        .lineWidth(0.5)
        .stroke();

      const values = [
        String(item.sNo),
        displayName,
        item.sku,
        item.hsnCode || "-",
        String(item.quantity),
        item.unit || "Packet",
        formatPaiseToInr(item.unitPricePaise),
        item.discountPaise > 0 ? formatPaiseToInr(item.discountPaise) : "₹0.00",
        formatPaiseToInr(item.taxableValuePaise),
        `${item.gstRate}%`,
        formatPaiseToInr(item.gstAmountPaise),
        formatPaiseToInr(item.totalPaise),
      ];

      let cx = leftMargin;
      for (let c = 0; c < cols.length; c++) {
        const col = cols[c];
        doc
          .font(c === 1 || c === 11 ? FONT_BOLD : FONT_REG)
          .fontSize(7)
          .fillColor(COLORS.inkBrown)
          .text(values[c], cx + 2, y + 6, {
            width: col.width - 4,
            align: col.align,
          });
        cx += col.width;
      }

      y += rowHeight;
    }

    y += 14;

    // =========================================================================
    // 4. PRICE SUMMARY, TAX BREAKDOWN & AMOUNT IN WORDS
    // =========================================================================
    const summaryHeight = 205;
    if (y + summaryHeight > pageHeight - footerReserveHeight) {
      doc.addPage();
      y = 32;
    }

    const summaryStartY = y;
    const leftSummaryWidth = 265;
    const rightSummaryWidth = contentWidth - leftSummaryWidth - 14;
    const rightSummaryX = leftMargin + leftSummaryWidth + 14;

    // Left panel: Amount in words, Payment Info, Terms
    doc
      .roundedRect(leftMargin, summaryStartY, leftSummaryWidth, 54, 4)
      .fillAndStroke(COLORS.ivoryLight, COLORS.border);
    doc
      .font(FONT_BOLD)
      .fontSize(7.5)
      .fillColor(COLORS.deepMaroon)
      .text("TOTAL AMOUNT IN WORDS", leftMargin + 10, summaryStartY + 8);
    doc
      .font(FONT_BOLD)
      .fontSize(8)
      .fillColor(COLORS.inkBrown)
      .text(invoice.amountInWords, leftMargin + 10, summaryStartY + 21, {
        width: leftSummaryWidth - 20,
      });

    let ly = summaryStartY + 64;
    doc
      .font(FONT_BOLD)
      .fontSize(7.8)
      .fillColor(COLORS.deepMaroon)
      .text("PAYMENT & TRANSACTION DETAILS", leftMargin, ly);
    ly += 12;
    doc
      .font(FONT_REG)
      .fontSize(7.5)
      .fillColor(COLORS.inkBrown)
      .text(`Method: ${invoice.paymentMethod}`, leftMargin, ly);
    ly += 11;
    doc.text(`Status: ${invoice.paymentStatus}`, leftMargin, ly);
    ly += 11;
    if (invoice.razorpayPaymentId || invoice.paymentReference) {
      doc.text(
        `Transaction ID: ${invoice.razorpayPaymentId || invoice.paymentReference}`,
        leftMargin,
        ly,
        { width: leftSummaryWidth }
      );
      ly += 11;
    }
    if (invoice.termsAndConditions) {
      ly += 6;
      doc
        .font(FONT_BOLD)
        .fontSize(7.5)
        .fillColor(COLORS.deepMaroon)
        .text("TERMS & CONDITIONS", leftMargin, ly);
      ly += 10;
      doc
        .font(FONT_REG)
        .fontSize(6.8)
        .fillColor(COLORS.mutedBrown)
        .text(invoice.termsAndConditions, leftMargin, ly, {
          width: leftSummaryWidth,
        });
    }

    // Right panel: Financial Breakdown
    const summaryRows: Array<{ label: string; value: string; bold?: boolean }> = [
      { label: "Subtotal", value: formatPaiseToInr(invoice.subtotalPaise) },
    ];
    if (invoice.productDiscountPaise > 0) {
      summaryRows.push({
        label: "Product Discounts",
        value: `- ${formatPaiseToInr(invoice.productDiscountPaise)}`,
      });
    }
    if (invoice.couponDiscountPaise > 0) {
      summaryRows.push({
        label: invoice.couponCode
          ? `Coupon (${invoice.couponCode})`
          : "Coupon Discount",
        value: `- ${formatPaiseToInr(invoice.couponDiscountPaise)}`,
      });
    }
    summaryRows.push({
      label: "Shipping Charges",
      value: formatPaiseToInr(invoice.shippingChargesPaise),
    });
    if (invoice.otherChargesPaise > 0) {
      summaryRows.push({
        label: "Other Charges",
        value: formatPaiseToInr(invoice.otherChargesPaise),
      });
    }
    summaryRows.push({
      label: "Taxable Amount",
      value: formatPaiseToInr(invoice.taxableAmountPaise),
      bold: true,
    });
    if (invoice.sellerDetailsSnapshot.isGstRegistered) {
      if (invoice.placeOfSupply.isInterstate) {
        summaryRows.push({
          label: "IGST",
          value: formatPaiseToInr(invoice.taxBreakdown.igstPaise),
        });
      } else {
        summaryRows.push({
          label: "CGST",
          value: formatPaiseToInr(invoice.taxBreakdown.cgstPaise),
        });
        summaryRows.push({
          label: "SGST",
          value: formatPaiseToInr(invoice.taxBreakdown.sgstPaise),
        });
      }
      summaryRows.push({
        label: "Total GST",
        value: formatPaiseToInr(invoice.taxBreakdown.totalGstPaise),
        bold: true,
      });
    }

    const boxRowsHeight = summaryRows.length * 14 + 64;
    doc
      .roundedRect(rightSummaryX, summaryStartY, rightSummaryWidth, boxRowsHeight, 4)
      .fillAndStroke(COLORS.ivoryLight, COLORS.border);

    let sy = summaryStartY + 8;
    for (const row of summaryRows) {
      doc
        .font(row.bold ? FONT_BOLD : FONT_REG)
        .fontSize(7.8)
        .fillColor(row.bold ? COLORS.inkBrown : COLORS.mutedBrown)
        .text(row.label, rightSummaryX + 10, sy, { width: 120 });

      doc
        .font(row.bold ? FONT_BOLD : FONT_REG)
        .fontSize(7.8)
        .fillColor(COLORS.inkBrown)
        .text(row.value, rightSummaryX + 130, sy, {
          width: rightSummaryWidth - 140,
          align: "right",
        });
      sy += 14;
    }

    // Prominent Grand Total Bar
    sy += 2;
    doc
      .rect(rightSummaryX + 1, sy, rightSummaryWidth - 2, 22)
      .fill(COLORS.deepMaroon);
    doc
      .font(FONT_BOLD)
      .fontSize(9)
      .fillColor(COLORS.mithilaIvory)
      .text("GRAND TOTAL", rightSummaryX + 10, sy + 6, { width: 110 });
    doc
      .font(FONT_BOLD)
      .fontSize(9.5)
      .fillColor(COLORS.haldiGold)
      .text(formatPaiseToInr(invoice.grandTotalPaise), rightSummaryX + 115, sy + 5.5, {
        width: rightSummaryWidth - 125,
        align: "right",
      });
    sy += 26;

    // Amount Paid & Balance Due
    doc
      .font(FONT_REG)
      .fontSize(7.8)
      .fillColor(COLORS.mutedBrown)
      .text("Amount Paid", rightSummaryX + 10, sy, { width: 110 });
    doc
      .font(FONT_BOLD)
      .fontSize(7.8)
      .fillColor(COLORS.leafGreen)
      .text(formatPaiseToInr(invoice.amountPaidPaise), rightSummaryX + 120, sy, {
        width: rightSummaryWidth - 130,
        align: "right",
      });
    sy += 13;

    doc
      .font(FONT_REG)
      .fontSize(7.8)
      .fillColor(COLORS.mutedBrown)
      .text("Balance Due", rightSummaryX + 10, sy, { width: 110 });
    doc
      .font(FONT_BOLD)
      .fontSize(7.8)
      .fillColor(
        invoice.balanceDuePaise > 0 ? COLORS.burntOrange : COLORS.inkBrown
      )
      .text(formatPaiseToInr(invoice.balanceDuePaise), rightSummaryX + 120, sy, {
        width: rightSummaryWidth - 130,
        align: "right",
      });

    // =========================================================================
    // 5. FOOTER ON ALL PAGES
    // =========================================================================
    const range = doc.bufferedPageRange();
    for (let i = 0; i < range.count; i++) {
      doc.switchToPage(range.start + i);
      const footerY = pageHeight - 54;

      doc
        .moveTo(leftMargin, footerY)
        .lineTo(pageWidth - rightMargin, footerY)
        .strokeColor(COLORS.border)
        .lineWidth(0.8)
        .stroke();

      doc
        .font(FONT_BOLD)
        .fontSize(8.5)
        .fillColor(COLORS.deepMaroon)
        .text(
          invoice.footerNote || "Thank you for choosing Maghora!",
          leftMargin,
          footerY + 7,
          { width: contentWidth, align: "center" }
        );

      doc
        .font(FONT_REG)
        .fontSize(7.5)
        .fillColor(COLORS.burntOrange)
        .text(
          invoice.footerTagline || "Ancient roots Modern Taste",
          leftMargin,
          footerY + 18,
          { width: contentWidth, align: "center" }
        );

      const policyText = `Website: ${seller.website || "https://maghora.in"}  |  Return & Refund Policy: ${seller.returnPolicyUrl || "https://maghora.in/terms"}  |  Support: ${seller.supportEmail}`;
      doc
        .font(FONT_REG)
        .fontSize(6.8)
        .fillColor(COLORS.mutedBrown)
        .text(policyText, leftMargin, footerY + 30, {
          width: contentWidth - 60,
          align: "left",
        });

      doc
        .font(FONT_REG)
        .fontSize(6.8)
        .fillColor(COLORS.mutedBrown)
        .text(`Page ${i + 1} of ${range.count}`, leftMargin, footerY + 30, {
          width: contentWidth,
          align: "right",
        });
    }

    doc.end();
  });
}
