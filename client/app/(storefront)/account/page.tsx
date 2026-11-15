"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User as UserIcon,
  MapPin,
  Lock,
  LogOut,
  Package,
  Plus,
  Trash2,
  CheckCircle2,
  Shield,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAddresses } from "@/hooks/useAddresses";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddressFormDialog } from "@/components/storefront/AddressFormDialog";
import { toast } from "sonner";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    password: z.string().min(8, "New password must be at least 8 characters").max(128),
    confirmPassword: z.string().min(8, "Confirm new password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.password, {
    message: "New password must be different from current password",
    path: ["password"],
  });

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const { addresses, setDefaultAddress, deleteAddress } = useAddresses();

  const [activeTab, setActiveTab] = useState<"profile" | "addresses" | "security">("profile");
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  });

  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/account");
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || !user) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-muted-foreground animate-pulse">Loading account...</p>
      </div>
    );
  }

  const onChangePasswordSubmit = async (data: ChangePasswordForm) => {
    try {
      setIsChangingPassword(true);
      await authService.changePassword(data);
      reset();
      toast.success("Password changed successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
          <div>
            <h1 className="text-3xl font-bold font-serif text-foreground">
              My Maghora Account
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your personal profile, addresses, security, and orders
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/orders")}
              className="gap-2 rounded-xl text-xs"
            >
              <Package className="h-4 w-4" /> View My Orders
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logout()}
              className="text-xs text-destructive hover:bg-destructive/10 rounded-xl gap-1.5"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Tabs Menu */}
          <div className="md:col-span-4 lg:col-span-3 space-y-1">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer text-left ${
                activeTab === "profile"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-card text-foreground hover:bg-muted"
              }`}
            >
              <UserIcon className="h-4 w-4" />
              <span>Profile Information</span>
            </button>

            <button
              onClick={() => setActiveTab("addresses")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer text-left ${
                activeTab === "addresses"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-card text-foreground hover:bg-muted"
              }`}
            >
              <MapPin className="h-4 w-4" />
              <span>Saved Addresses ({addresses.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer text-left ${
                activeTab === "security"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-card text-foreground hover:bg-muted"
              }`}
            >
              <Lock className="h-4 w-4" />
              <span>Login & Security</span>
            </button>
          </div>

          {/* Right Tab Content */}
          <div className="md:col-span-8 lg:col-span-9">
            {/* Tab 1: Profile */}
            {activeTab === "profile" && (
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
                <h2 className="text-xl font-bold font-serif text-foreground">
                  Personal Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60">
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                      Full Name
                    </span>
                    <p className="text-base font-bold text-foreground mt-0.5">{user.name}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60">
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                      Mobile Number
                    </span>
                    <p className="text-base font-bold text-foreground mt-0.5">{user.phone}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60 sm:col-span-2">
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                      Email Address
                    </span>
                    <p className="text-base font-bold text-foreground mt-0.5">{user.email}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/60 flex items-center gap-3 text-xs text-muted-foreground">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Your account role is <strong className="text-foreground uppercase">{user.role}</strong>.</span>
                </div>
              </div>
            )}

            {/* Tab 2: Addresses */}
            {activeTab === "addresses" && (
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-border/60">
                  <div>
                    <h2 className="text-xl font-bold font-serif text-foreground">
                      Delivery Addresses
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Save multiple shipping locations for seamless one-click checkout
                    </p>
                  </div>

                  <Button
                    onClick={() => setShowAddressDialog(true)}
                    size="sm"
                    className="rounded-xl gap-1 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Address
                  </Button>
                </div>

                {addresses.length === 0 ? (
                  <div className="p-12 text-center border border-dashed border-border rounded-2xl">
                    <p className="text-sm text-muted-foreground mb-4">
                      No saved addresses found.
                    </p>
                    <Button onClick={() => setShowAddressDialog(true)} size="sm">
                      Add Your First Address
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr._id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                          addr.isDefault ? "border-primary bg-primary/5" : "border-border bg-background"
                        }`}
                      >
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-sm text-foreground">
                              {addr.recipientName}
                            </span>
                            <span className="capitalize font-semibold text-[10px] bg-secondary px-2 py-0.5 rounded-full text-secondary-foreground">
                              {addr.label}
                            </span>
                          </div>
                          <p className="text-foreground/80 leading-relaxed pt-1">
                            {addr.addressLine1}
                            {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                            {addr.landmark ? `, ${addr.landmark}` : ""}
                          </p>
                          <p className="text-muted-foreground">
                            {addr.city}, {addr.state} - {addr.postalCode}
                          </p>
                          <p className="text-foreground font-medium pt-1">📞 {addr.phone}</p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                          {addr.isDefault ? (
                            <span className="text-[11px] font-bold text-primary flex items-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Default Address
                            </span>
                          ) : (
                            <button
                              onClick={() => setDefaultAddress(addr._id)}
                              className="text-[11px] font-medium text-accent hover:underline cursor-pointer"
                            >
                              Set as Default
                            </button>
                          )}

                          <button
                            onClick={() => deleteAddress(addr._id)}
                            className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors cursor-pointer"
                            title="Delete Address"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Security */}
            {activeTab === "security" && (
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6 max-w-lg">
                <div>
                  <h2 className="text-xl font-bold font-serif text-foreground">
                    Change Password
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Update your account password using argon2id cryptographic hashing
                  </p>
                </div>

                <form onSubmit={handleSubmit(onChangePasswordSubmit)} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Current Password *</Label>
                    <Input
                      type="password"
                      {...register("currentPassword")}
                      placeholder="••••••••"
                      error={errors.currentPassword?.message}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">New Password *</Label>
                    <Input
                      type="password"
                      {...register("password")}
                      placeholder="Minimum 8 characters"
                      error={errors.password?.message}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Confirm New Password *</Label>
                    <Input
                      type="password"
                      {...register("confirmPassword")}
                      placeholder="Re-enter new password"
                      error={errors.confirmPassword?.message}
                    />
                  </div>

                  <Button
                    type="submit"
                    isLoading={isChangingPassword}
                    className="rounded-xl font-bold"
                  >
                    Update Password
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      <AddressFormDialog
        open={showAddressDialog}
        onOpenChange={setShowAddressDialog}
      />
    </div>
  );
}

