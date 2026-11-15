"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, Mail, Phone, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  identifier: z.string().trim().min(1, "Please enter your email or phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  const { login, isLoggingIn, isAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, redirectUrl, router]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      router.push(redirectUrl);
    } catch {
      // Toast already shown in hook
    }
  };

  return (
    <div className="py-16 sm:py-24 bg-background flex flex-col justify-center min-h-[calc(100vh-120px)]">
      <div className="mx-auto w-full max-w-md px-4 sm:px-6">
        <div className="rounded-3xl border border-border bg-card p-8 sm:p-10 shadow-lg space-y-6">
          {/* Logo & Headline */}
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
              Welcome Back
            </h1>
            <p className="text-xs text-muted-foreground">
              Sign in to your Maghora account to access orders and basket
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Email or Mobile Number</Label>
              <Input
                {...register("identifier")}
                placeholder="name@example.com or 9876543210"
                error={errors.identifier?.message}
                autoComplete="username"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-accent hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                {...register("password")}
                placeholder="••••••••"
                error={errors.password?.message}
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              isLoading={isLoggingIn}
              className="w-full rounded-xl font-bold h-11"
            >
              Sign In <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </form>

          {/* Footer */}
          <div className="pt-2 text-center text-xs text-muted-foreground border-t border-border/60">
            Don&apos;t have an account yet?{" "}
            <Link
              href={`/register${redirectUrl !== "/" ? `?redirect=${redirectUrl}` : ""}`}
              className="font-bold text-primary hover:underline"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground text-sm">Loading sign in...</div>
        </div>
      }
    >
      <LoginForm />
    </React.Suspense>
  );
}
