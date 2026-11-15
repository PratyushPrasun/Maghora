"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
              Reset Password
            </h1>
            <p className="text-xs text-muted-foreground">
              Enter your registered email address and we&apos;ll send you a secure 15-minute recovery link.
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-6 bg-secondary/30 rounded-2xl border border-border text-center space-y-3">
              <CheckCircle2 className="h-10 w-10 text-primary mx-auto" />
              <h3 className="text-sm font-bold text-foreground">Check Your Inbox</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                If your email is linked to a Maghora account, an email with instructions to choose a new password has been sent.
              </p>
              <Link href="/login" className="inline-block pt-2">
                <Button variant="outline" size="sm">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Registered Email</Label>
                <Input
                  type="email"
                  {...register("email")}
                  placeholder="name@example.com"
                  error={errors.email?.message}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                isLoading={isSubmitting}
                className="w-full rounded-xl font-bold h-11"
              >
                Send Reset Link
              </Button>
            </form>
          )}

          <div className="pt-2 text-center text-xs text-muted-foreground border-t border-border/60">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

