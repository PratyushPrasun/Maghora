import crypto from "node:crypto";
import type { Request, Response } from "express";

import { env } from "../../config/env.js";

import {
  processRazorpayWebhookEvent,
} from "./payment.service.js";

import {
  PaymentWebhookEvent,
} from "./payment.model.js";

function verifyWebhookSignature(
  rawBody: Buffer,
  receivedSignature: string
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  if (!/^[a-fA-F0-9]{64}$/.test(receivedSignature)) {
    return false;
  }

  const expected = Buffer.from(expectedSignature, "hex");
  const received = Buffer.from(receivedSignature, "hex");

  return (
    expected.length === received.length &&
    crypto.timingSafeEqual(expected, received)
  );
}

export async function razorpayWebhookController(
  req: Request,
  res: Response
) {
  const rawBody = req.rawBody;
  const signature = req.headers["x-razorpay-signature"];

  if (!rawBody || !Buffer.isBuffer(rawBody)) {
    res.status(400).json({
      success: false,
      message: "Original webhook request body is missing",
    });
    return;
  }

  if (
    typeof signature !== "string" ||
    !verifyWebhookSignature(rawBody, signature)
  ) {
    res.status(400).json({
      success: false,
      message: "Invalid webhook signature",
    });
    return;
  }

  let event: any;

  try {
    event = JSON.parse(rawBody.toString("utf8"));
  } catch {
    res.status(400).json({
      success: false,
      message: "Invalid webhook JSON",
    });
    return;
  }

  const eventName = event?.event;

  const supportedEvents = [
    "payment.captured",
    "payment.failed",
    "refund.processed",
    "refund.failed",
  ];

  if (!supportedEvents.includes(eventName)) {
    res.status(200).json({
      success: true,
      message: "Event ignored",
    });
    return;
  }

  // Razorpay's event ID is preferred. The raw-body hash is a
  // fallback for environments where that header is unavailable.
  const headerEventId = req.headers["x-razorpay-event-id"];

  const eventId =
    typeof headerEventId === "string" && headerEventId.length > 0
      ? headerEventId
      : crypto.createHash("sha256").update(rawBody).digest("hex");

  try {
    await PaymentWebhookEvent.create({
      eventId,
      event: eventName,
      status: "processing",
    });
  } catch (error: any) {
    if (error?.code === 11000) {
      const existingEvent = await PaymentWebhookEvent.findOne({
        eventId,
      }).lean();

      if (existingEvent?.status === "processed") {
        res.status(200).json({
          success: true,
          message: "Duplicate webhook ignored",
        });
      } else {
        // Do not acknowledge an event that may have been interrupted.
        // Razorpay should retry it.
        res.status(500).json({
          success: false,
          message: "Webhook event is still pending processing",
        });
      }

      return;
    }

    throw error;
  }

  try {
    await processRazorpayWebhookEvent(event);

    await PaymentWebhookEvent.updateOne(
      { eventId },
      {
        $set: {
          status: "processed",
          processedAt: new Date(),
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Webhook processed",
    });
  } catch (error) {
    // Delete the event record so Razorpay's retry can process it again.
    await PaymentWebhookEvent.deleteOne({ eventId });

    console.error("Razorpay webhook processing failed:", error);

    res.status(500).json({
      success: false,
      message: "Webhook processing failed",
    });
  }
}