"use client";

import React, { useState } from "react";
import Script from "next/script";
import { Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { paymentsService } from "@/services/payments.service";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

interface RazorpayCheckoutButtonProps {
  amount: number; // in paise, minimum 100 paise
  currency?: string;
  receipt?: string;
  name?: string;
  description?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess?: (paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  onFailure?: (error: any) => void;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function RazorpayCheckoutButton({
  amount,
  currency = "INR",
  receipt,
  name = "Maghora Foods",
  description = "Makhana Payment",
  prefill,
  onSuccess,
  onFailure,
  className,
  disabled = false,
  children,
}: RazorpayCheckoutButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const loadScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && window.Razorpay) {
        resolve(true);
        return;
      }
      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );
      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(true));
        existingScript.addEventListener("error", () => resolve(false));
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    if (amount < 100) {
      toast.error("Minimum payment amount is 100 paise (₹1.00)");
      return;
    }

    try {
      setIsProcessing(true);

      // 1. Ensure Razorpay checkout script is loaded
      const isLoaded = await loadScript();
      if (!isLoaded || typeof window.Razorpay === "undefined") {
        toast.error("Could not load payment gateway. Please check your internet connection.");
        setIsProcessing(false);
        return;
      }

      // 2. Step 1: Call backend endpoint to create Razorpay Order
      const order = await paymentsService.createStandardOrder(amount, currency, receipt);

      if (!order?.order_id) {
        throw new Error("Failed to initialize payment order.");
      }

      const keyId =
        order.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";

      // 3. Step 2: Open Razorpay Standard Checkout modal
      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency || currency,
        name,
        description,
        order_id: order.order_id,
        prefill: {
          name: prefill?.name || "",
          email: prefill?.email || "",
          contact: prefill?.contact || "",
        },
        theme: {
          color: "#702C32",
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast.error("Payment cancelled by user");
            if (onFailure) {
              onFailure(new Error("User cancelled checkout"));
            }
          },
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // 4. Step 3: Send all three fields to verify endpoint
            const verifyResult = await paymentsService.verifyStandardPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyResult.success) {
              toast.success("Payment verified successfully!");
              if (onSuccess) {
                onSuccess(response);
              }
            } else {
              toast.error(verifyResult.message || "Payment verification failed.");
              if (onFailure) {
                onFailure(new Error(verifyResult.message));
              }
            }
          } catch (err: any) {
            const errorMsg =
              err?.response?.data?.message ||
              err?.message ||
              "Payment verification failed.";
            toast.error(errorMsg);
            if (onFailure) {
              onFailure(err);
            }
          } finally {
            setIsProcessing(false);
          }
        },
      };

      const rzpInstance = new window.Razorpay(options);

      // Handle payment.failed event
      rzpInstance.on("payment.failed", (response: any) => {
        setIsProcessing(false);
        const description =
          response?.error?.description || "Payment failed. Please retry.";
        toast.error(description);
        if (onFailure) {
          onFailure(response.error);
        }
      });

      rzpInstance.open();
    } catch (err: any) {
      setIsProcessing(false);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to start checkout. Please try again.";
      toast.error(message);
      if (onFailure) {
        onFailure(err);
      }
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <Button
        onClick={handleCheckout}
        disabled={disabled || isProcessing}
        className={
          className ||
          "rounded-xl gap-2 font-serif font-bold uppercase tracking-wider text-xs h-12 bg-[#702C32] hover:bg-[#551F24] text-[#F8EEDC] shadow-md cursor-pointer"
        }
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          children || (
            <>
              <Lock className="h-4 w-4" />
              <span>Pay Now</span>
            </>
          )
        )}
      </Button>
    </>
  );
}
export default RazorpayCheckoutButton;
