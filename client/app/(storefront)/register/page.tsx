"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MithilaLotus, MithilaCorner } from "@/components/storefront/MithilaMotifs";

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
    <div className="py-12 sm:py-20 bg-[#F8EEDC] flex flex-col justify-center min-h-[calc(100vh-140px)]">
      <div className="mx-auto w-full max-w-md px-4 sm:px-6">
        <div className="relative rounded-2xl sm:rounded-3xl border border-[#E8D7BE] bg-white p-5 sm:p-10 shadow-[0_12px_40px_rgba(112,44,50,0.06)] space-y-5 sm:space-y-6">
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
              Create Your Account
            </h1>
            <p className="text-xs text-[#7B685F]">
              Join Maghora for gourmet flavours, fast checkout, and exclusive perks
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            <div className="space-y-1">
              <Label className="text-xs font-serif font-bold uppercase tracking-wider text-[#33251F]">
                Full Name *
              </Label>
              <Input
                {...register("name")}
                placeholder="Rohit Sharma"
                error={errors.name?.message}
                autoComplete="name"
                className="border-[#E8D7BE] text-xs focus:ring-[#702C32]/30"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-serif font-bold uppercase tracking-wider text-[#33251F]">
                Mobile Number *
              </Label>
              <Input
                {...register("phone")}
                placeholder="9876543210"
                error={errors.phone?.message}
                autoComplete="tel"
                className="border-[#E8D7BE] text-xs focus:ring-[#702C32]/30"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-serif font-bold uppercase tracking-wider text-[#33251F]">
                Email Address *
              </Label>
              <Input
                type="email"
                {...register("email")}
                placeholder="rohit@example.com"
                error={errors.email?.message}
                autoComplete="email"
                className="border-[#E8D7BE] text-xs focus:ring-[#702C32]/30"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-serif font-bold uppercase tracking-wider text-[#33251F]">
                Password *
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

            <div className="space-y-1">
              <Label className="text-xs font-serif font-bold uppercase tracking-wider text-[#33251F]">
                Confirm Password *
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
              isLoading={isRegistering}
              className="w-full rounded-xl font-serif font-bold uppercase tracking-wider text-xs h-11 bg-[#702C32] hover:bg-[#551F24] text-[#F8EEDC] shadow-md mt-2 cursor-pointer"
            >
              Register Account
            </Button>
          </form>

          <div className="pt-3 border-t border-[#E8D7BE]/70 text-center text-xs text-[#7B685F]">
            Already have an account?{" "}
            <Link
              href={redirectUrl !== "/" ? `/login?redirect=${redirectUrl}` : "/login"}
              className="text-[#702C32] font-bold hover:underline"
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
    <React.Suspense fallback={<div className="p-12 text-center text-xs text-[#7B685F]">Loading...</div>}>
      <RegisterForm />
    </React.Suspense>
  );
}
