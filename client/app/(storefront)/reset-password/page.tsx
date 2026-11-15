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
    <div className="py-16 sm:py-24 bg-background flex flex-col justify-center min-h-[calc(100vh-120px)]">
      <div className="mx-auto w-full max-w-md px-4 sm:px-6">
        <div className="rounded-3xl border border-border bg-card p-8 sm:p-10 shadow-lg space-y-6">
          <div className="text-center space-y-2">
            <Link href="/" className="inline-block relative h-12 w-36 mx-auto mb-2">
              <Image
                src="/Magnora.png"
                alt="Maghora"
                fill
                priority
                className="object-contain"
              />
            </Link>
            <h1 className="text-2xl font-bold font-serif text-foreground">
              Create New Password
            </h1>
            <p className="text-xs text-muted-foreground">
              Please choose a strong password of at least 8 characters
            </p>
          </div>

          {!token ? (
            <div className="p-6 bg-destructive/10 rounded-2xl border border-destructive/20 text-center space-y-3">
              <p className="text-xs text-destructive font-medium">
                Missing or invalid password reset token. Please request a new link from the forgot password page.
              </p>
              <Link href="/forgot-password">
                <Button variant="outline" size="sm">
                  Request New Link
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">New Password</Label>
                <Input
                  type="password"
                  {...register("password")}
                  placeholder="Minimum 8 characters"
                  error={errors.password?.message}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Confirm New Password</Label>
                <Input
                  type="password"
                  {...register("confirmPassword")}
                  placeholder="Re-enter new password"
                  error={errors.confirmPassword?.message}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                isLoading={isSubmitting}
                className="w-full rounded-xl font-bold h-11"
              >
                Update Password
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground text-sm">Validating recovery link...</div>
        </div>
      }
    >
      <ResetPasswordContent />
    </React.Suspense>
  );
}
