"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MithilaCorner } from "@/components/storefront/MithilaMotifs";
import { toast } from "sonner";

const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await authService.forgotPassword({ email: data.email });
      setIsSubmitted(true);
      toast.success("If an account exists, a reset link has been dispatched.");
    } catch (err: any) {
      toast.error(err?.message || "Failed to process password reset request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 sm:py-20 bg-[#F8EEDC] flex flex-col justify-center min-h-[calc(100vh-140px)]">
      <div className="mx-auto w-full max-w-md px-4 sm:px-6">
        <div className="relative rounded-2xl sm:rounded-3xl border border-[#E8D7BE] bg-white p-5 sm:p-10 shadow-[0_12px_40px_rgba(112,44,50,0.06)] space-y-6">
          <MithilaCorner className="absolute top-3 left-3 h-5 w-5 text-[#E8B84E]" />
          <MithilaCorner className="absolute top-3 right-3 h-5 w-5 text-[#E8B84E] rotate-90" />
          <MithilaCorner className="absolute bottom-3 left-3 h-5 w-5 text-[#E8B84E] -rotate-90" />
          <MithilaCorner className="absolute bottom-3 right-3 h-5 w-5 text-[#E8B84E] rotate-180" />

          <div className="text-center space-y-2">
            <Link href="/" className="inline-block relative h-16 w-16 mx-auto mb-1">
              <Image
                src="/logo.png"
                alt="Maghora"
                fill
                priority
                className="object-contain"
              />
            </Link>
            <h1 className="text-2xl font-bold font-serif text-[#33251F]">
              Reset Password
            </h1>
            <p className="text-xs text-[#7B685F]">
              Enter your registered email address and we&apos;ll send you a secure 15-minute recovery link.
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-6 bg-[#F8EEDC]/40 rounded-2xl border border-[#E8D7BE] text-center space-y-3">
              <CheckCircle2 className="h-10 w-10 text-[#536B42] mx-auto" />
              <h3 className="text-sm font-bold font-serif text-[#33251F]">Check Your Inbox</h3>
              <p className="text-xs text-[#7B685F] leading-relaxed">
                If your email is linked to a Maghora account, an email with instructions to choose a new password has been sent.
              </p>
              <Link href="/login" className="inline-block pt-2">
                <Button variant="outline" size="sm" className="border-[#E8D7BE] text-xs font-serif uppercase tracking-wider">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-serif font-bold uppercase tracking-wider text-[#33251F]">
                  Registered Email
                </Label>
                <Input
                  type="email"
                  {...register("email")}
                  placeholder="name@example.com"
                  error={errors.email?.message}
                  className="border-[#E8D7BE] text-xs focus:ring-[#702C32]/30"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                isLoading={isSubmitting}
                className="w-full rounded-xl font-serif font-bold uppercase tracking-wider text-xs h-11 bg-[#702C32] hover:bg-[#551F24] text-[#F8EEDC] shadow-md cursor-pointer"
              >
                Send Reset Link
              </Button>
            </form>
          )}

          <div className="pt-2 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-[#7B685F] hover:text-[#702C32] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
