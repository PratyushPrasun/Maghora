"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
    phone: z
      .string()
      .trim()
      .min(10, "Phone number is required")
      .max(20, "Invalid phone number"),
    email: z.string().trim().email("Please enter a valid email address").max(254),
    password: z.string().min(8, "Password must be at least 8 characters").max(128),
    confirmPassword: z.string().min(8, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  const { register: registerUser, isRegistering, isAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, redirectUrl, router]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        name: data.name,
        phone: data.phone,
        email: data.email,
        password: data.password,
      });
      router.push(redirectUrl);
    } catch {
      // Toast handled in hook
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
              Create Your Account
            </h1>
            <p className="text-xs text-muted-foreground">
              Join Maghora for gourmet flavours, fast checkout, and exclusive perks
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Full Name *</Label>
              <Input
                {...register("name")}
                placeholder="Rohit Sharma"
                error={errors.name?.message}
                autoComplete="name"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Mobile Number *</Label>
              <Input
                {...register("phone")}
                placeholder="+919876543210 or 9876543210"
                error={errors.phone?.message}
                autoComplete="tel"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Email Address *</Label>
              <Input
                type="email"
                {...register("email")}
                placeholder="name@example.com"
                error={errors.email?.message}
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Password *</Label>
              <Input
                type="password"
                {...register("password")}
                placeholder="Minimum 8 characters"
                error={errors.password?.message}
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Confirm Password *</Label>
              <Input
                type="password"
                {...register("confirmPassword")}
                placeholder="Re-enter password"
                error={errors.confirmPassword?.message}
                autoComplete="new-password"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              isLoading={isRegistering}
              className="w-full rounded-xl font-bold h-11"
            >
              Create Account <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-muted-foreground border-t border-border/60">
            Already have an account?{" "}
            <Link
              href={`/login${redirectUrl !== "/" ? `?redirect=${redirectUrl}` : ""}`}
              className="font-bold text-primary hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground text-sm">Loading registration...</div>
        </div>
      }
    >
      <RegisterForm />
    </React.Suspense>
  );
}
