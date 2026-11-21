"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MithilaLotus, MithilaCorner } from "@/components/storefront/MithilaMotifs";

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
    <div className="py-12 sm:py-20 bg-[#F8EEDC] flex flex-col justify-center min-h-[calc(100vh-140px)]">
      <div className="mx-auto w-full max-w-md px-4 sm:px-6">
        <div className="relative rounded-2xl sm:rounded-3xl border border-[#E8D7BE] bg-white p-5 sm:p-10 shadow-[0_12px_40px_rgba(112,44,50,0.06)] space-y-6">
          <MithilaCorner className="absolute top-3 left-3 h-5 w-5 text-[#E8B84E]" />
          <MithilaCorner className="absolute top-3 right-3 h-5 w-5 text-[#E8B84E] rotate-90" />
          <MithilaCorner className="absolute bottom-3 left-3 h-5 w-5 text-[#E8B84E] -rotate-90" />
          <MithilaCorner className="absolute bottom-3 right-3 h-5 w-5 text-[#E8B84E] rotate-180" />

          {/* Logo & Headline */}
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
              Welcome Back
            </h1>
            <p className="text-xs text-[#7B685F]">
              Sign in to your Maghora account to access orders and basket
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-serif font-bold uppercase tracking-wider text-[#33251F]">
                Email or Mobile Number
              </Label>
              <Input
                {...register("identifier")}
                placeholder="name@example.com or 9876543210"
                error={errors.identifier?.message}
                autoComplete="username"
                className="border-[#E8D7BE] text-xs focus:ring-[#702C32]/30"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-serif font-bold uppercase tracking-wider text-[#33251F]">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#C65D35] hover:underline font-medium"
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
                className="border-[#E8D7BE] text-xs focus:ring-[#702C32]/30"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              isLoading={isLoggingIn}
              className="w-full rounded-xl font-serif font-bold uppercase tracking-wider text-xs h-11 bg-[#702C32] hover:bg-[#551F24] text-[#F8EEDC] shadow-md cursor-pointer"
            >
              Sign In to Maghora
            </Button>
          </form>

          {/* Switch to Register */}
          <div className="pt-4 border-t border-[#E8D7BE]/70 text-center text-xs text-[#7B685F]">
            Don&apos;t have an account yet?{" "}
            <Link
              href={redirectUrl !== "/" ? `/register?redirect=${redirectUrl}` : "/register"}
              className="text-[#702C32] font-bold hover:underline"
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
    <React.Suspense fallback={<div className="p-12 text-center text-xs text-[#7B685F]">Loading...</div>}>
      <LoginForm />
    </React.Suspense>
  );
}
