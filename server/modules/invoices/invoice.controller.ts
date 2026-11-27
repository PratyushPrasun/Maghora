import type { Request, Response, NextFunction } from "express";

import {
  getCustomerInvoiceById,
  getCustomerInvoiceByOrderId,
  getInvoicePdfBuffer,
  listCustomerInvoices,
  sanitizeInvoiceForResponse,
} from "./invoice.service.js";

function getUserId(req: Request): string {
  if (!req.currentUser) {
    throw new Error("Authenticated user not found");
  }
  return req.currentUser._id.toString();
}

export async function getMyInvoices(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const invoices = await listCustomerInvoices(getUserId(req));
    res.status(200).json({
      success: true,
      data: invoices.map(sanitizeInvoiceForResponse),
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyInvoiceByOrder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const orderId = String(req.params.orderId || "");
    const invoice = await getCustomerInvoiceByOrderId(getUserId(req), orderId);
    res.status(200).json({
      success: true,
      data: invoice ? sanitizeInvoiceForResponse(invoice) : null,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyInvoiceById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const invoiceId = String(req.params.invoiceId || "");
    const invoice = await getCustomerInvoiceById(getUserId(req), invoiceId);
    res.status(200).json({
      success: true,
      data: sanitizeInvoiceForResponse(invoice),
    });
  } catch (error) {
    next(error);
  }
}

export async function downloadMyInvoicePdf(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const invoiceId = String(req.params.invoiceId || "");
    const invoice = await getCustomerInvoiceById(getUserId(req), invoiceId);
    const pdfBuffer = await getInvoicePdfBuffer(invoice);

    const safeFileName = `${invoice.invoiceNumber.replace(/[^A-Za-z0-9_-]/g, "-")}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeFileName}"`
    );
    res.setHeader("Content-Length", String(pdfBuffer.length));
    res.setHeader("Cache-Control", "private, no-store");
    res.status(200).send(pdfBuffer);
  } catch (error) {
    next(error);
  }
}
