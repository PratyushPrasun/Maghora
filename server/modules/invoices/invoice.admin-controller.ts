import type { Request, Response, NextFunction } from "express";

import {
  createAdjustmentNote,
  generateInvoiceForOrder,
  getAdminInvoiceById,
  getAdminInvoiceStats,
  getInvoicePdfBuffer,
  getOrCreateInvoiceSettings,
  listAdminInvoices,
  sanitizeInvoiceForResponse,
  updateInvoiceSettings,
} from "./invoice.service.js";
import {
  adminInvoiceQuerySchema,
  createAdjustmentNoteSchema,
  updateInvoiceSettingsSchema,
} from "./invoice.validation.js";

export async function listInvoicesAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = adminInvoiceQuerySchema.parse(req.query);
    const result = await listAdminInvoices(parsed);

    res.status(200).json({
      success: true,
      data: {
        invoices: result.invoices.map(sanitizeInvoiceForResponse),
        pagination: result.pagination,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getInvoiceStatsAdmin(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const stats = await getAdminInvoiceStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}

export async function getInvoiceByIdAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const invoiceId = String(req.params.invoiceId || "");
    const invoice = await getAdminInvoiceById(invoiceId);
    res.status(200).json({
      success: true,
      data: sanitizeInvoiceForResponse(invoice),
    });
  } catch (error) {
    next(error);
  }
}

export async function downloadInvoicePdfAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const invoiceId = String(req.params.invoiceId || "");
    const invoice = await getAdminInvoiceById(invoiceId);
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

export async function generateInvoiceForOrderAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const orderId = String(req.params.orderId || "");
    const invoice = await generateInvoiceForOrder(orderId);
    res.status(200).json({
      success: true,
      message: "Invoice ready",
      data: sanitizeInvoiceForResponse(invoice),
    });
  } catch (error) {
    next(error);
  }
}

export async function createInvoiceAdjustmentNoteAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const invoiceId = String(req.params.invoiceId || "");
    const body = createAdjustmentNoteSchema.parse(req.body);
    const note = await createAdjustmentNote(invoiceId, body);

    if (req.currentUser) {
      console.info(
        `[Invoice] ${body.noteType} ${note.invoiceNumber} issued by admin=${req.currentUser._id.toString()} for parent=${invoiceId}`
      );
    }

    res.status(201).json({
      success: true,
      message: `${note.invoiceType} issued successfully`,
      data: sanitizeInvoiceForResponse(note),
    });
  } catch (error) {
    next(error);
  }
}

export async function getInvoiceSettingsAdmin(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const settings = await getOrCreateInvoiceSettings();
    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateInvoiceSettingsAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.currentUser) {
      throw new Error("Authenticated admin not found");
    }
    const body = updateInvoiceSettingsSchema.parse(req.body);
    const settings = await updateInvoiceSettings(
      body,
      req.currentUser._id.toString()
    );

    console.info(
      `[Invoice] Settings updated by admin=${req.currentUser._id.toString()} fields=${Object.keys(body).join(",")}`
    );

    res.status(200).json({
      success: true,
      message: "Business & GST invoice settings updated",
      data: settings,
    });
  } catch (error) {
    next(error);
  }
}
