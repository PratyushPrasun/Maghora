"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MithilaCorner } from "@/components/storefront/MithilaMotifs";
import { toast } from "sonner";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters").max(128),
    confirmPassword: z.string().min(8, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: FormData) => {
    if (!token) {
      toast.error("Invalid or missing reset token. Please request a new link.");
      return;
    }

    try {
      setIsSubmitting(true);
      await authService.resetPassword({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      toast.success("Password reset successfully! Please sign in with your new password.");
      router.push("/login");
    } catch (err: any) {
      toast.error(err?.message || "Failed to reset password. The link may have expired.");
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
              Create New Password
            </h1>
            <p className="text-xs text-[#7B685F]">
              Please choose a strong password of at least 8 characters
            </p>
          </div>

          {!token ? (
            <div className="p-6 bg-rose-50 rounded-2xl border border-rose-200 text-center space-y-3">
              <p className="text-xs text-rose-700 font-medium">
                Missing or invalid password reset token. Please request a new link from the forgot password page.
              </p>
              <Link href="/forgot-password">
                <Button variant="outline" size="sm" className="border-[#E8D7BE] text-xs font-serif uppercase tracking-wider">
                  Request New Link
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-serif font-bold uppercase tracking-wider text-[#33251F]">
                  New Password
                </Label>
                <Input
                  type="password"
                  {...register("password")}
                  placeholder="At least 8 characters"
                  error={errors.password?.message}
                  autoComplete="new-password"
                  className="border-[#E8D7BE] text-xs focus:ring-[#702C32]/30"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-serif font-bold uppercase tracking-wider text-[#33251F]">
                  Confirm New Password
                </Label>
                <Input
                  type="password"
                  {...register("confirmPassword")}
                  placeholder="Re-enter password"
                  error={errors.confirmPassword?.message}
                  autoComplete="new-password"
                  className="border-[#E8D7BE] text-xs focus:ring-[#702C32]/30"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                isLoading={isSubmitting}
                className="w-full rounded-xl font-serif font-bold uppercase tracking-wider text-xs h-11 bg-[#702C32] hover:bg-[#551F24] text-[#F8EEDC] shadow-md cursor-pointer"
              >
                Set New Password
              </Button>
            </form>
          )}

          <div className="pt-2 text-center">
            <Link
              href="/login"
              className="text-xs text-[#7B685F] hover:text-[#702C32] transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <React.Suspense fallback={<div className="p-12 text-center text-xs text-[#7B685F]">Loading...</div>}>
      <ResetPasswordContent />
    </React.Suspense>
  );
}
