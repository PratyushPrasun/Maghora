"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ShieldCheck, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const adminLoginSchema = z.object({
  identifier: z.string().trim().min(1, "Enter administrative phone or email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof adminLoginSchema>;

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/admin/dashboard";
  const { login, isLoggingIn, isAuthenticated, isAdmin } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(adminLoginSchema),
  });

  React.useEffect(() => {
    if (isAuthenticated && isAdmin) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, isAdmin, redirectUrl, router]);

  const onSubmit = async (data: FormData) => {
    try {
      const result = await login(data);
      if (result.user.role === "admin" || result.user.role === "super_admin") {
        toast.success(`Welcome to Admin Console, ${result.user.name}`);
        router.push(redirectUrl);
      } else {
        toast.error("Access restricted: This account does not have administrative privileges.");
      }
    } catch {
      // Error toasted in hook
    }
  };

  return (
    <div className="min-h-screen bg-[#112519] flex flex-col justify-center items-center p-4 sm:p-6 text-white">
      <div className="w-full max-w-md bg-[#183624] border border-[#2A563C] rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-3">
          <div className="relative h-12 w-36 mx-auto brightness-0 invert">
            <Image src="/Magnora.png" alt="Maghora Admin" fill className="object-contain" priority />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent text-xs font-bold">
            <ShieldCheck className="h-4 w-4" />
            <span>Administrative Gateway</span>
          </div>

          <h1 className="text-2xl font-bold font-serif">Staff Sign In</h1>
          <p className="text-xs text-white/60">
            Secure authentication for Maghora store operations and catalogue management
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <Label className="text-xs text-white/80">Admin Email or Mobile</Label>
            <Input
              {...register("identifier")}
              placeholder="admin@maghora.com"
              error={errors.identifier?.message}
              className="bg-[#112519] border-[#2A563C] text-white placeholder:text-white/30"
              autoComplete="username"
            />
          </div>

          <div className="space-y-1.5 text-left">
            <Label className="text-xs text-white/80">Password</Label>
            <Input
              type="password"
              {...register("password")}
              placeholder="••••••••••••"
              error={errors.password?.message}
              className="bg-[#112519] border-[#2A563C] text-white placeholder:text-white/30"
              autoComplete="current-password"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            isLoading={isLoggingIn}
            className="w-full rounded-xl bg-accent hover:bg-accent-hover text-white font-bold h-11 shadow-lg"
          >
            Authorize Access <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </form>

        <div className="pt-2 text-center text-xs text-white/50 border-t border-white/10">
          <Link href="/" className="hover:text-white transition-colors">
            ← Return to Customer Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#112519] flex items-center justify-center text-white">
          <div className="animate-pulse">Loading Admin Gateway...</div>
        </div>
      }
    >
      <AdminLoginContent />
    </React.Suspense>
  );
}
