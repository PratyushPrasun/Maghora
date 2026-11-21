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
import { MithilaLotus } from "@/components/storefront/MithilaMotifs";
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
      <div className="py-28 text-center bg-[#F8EEDC] min-h-screen flex flex-col items-center justify-center">
        <div className="relative mb-3">
          <MithilaLotus className="h-9 w-9 text-[#E8B84E] animate-pulse" />
        </div>
        <p className="text-xs sm:text-sm font-serif font-bold text-[#702C32] tracking-[0.2em] uppercase">
          Loading Maghora Account...
        </p>
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
    <div className="py-8 sm:py-14 bg-[#F8EEDC] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E8D7BE]/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEDEC4]/60 border border-[#E8D7BE] text-[10px] font-bold uppercase tracking-[0.22em] text-[#702C32] mb-1.5 font-serif">
              <MithilaLotus className="h-3 w-3 text-[#E8B84E]" />
              <span>Customer Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[#33251F]">
              My Maghora Account
            </h1>
            <p className="text-xs sm:text-sm text-[#7B685F] mt-1">
              Manage your personal profile, addresses, security, and orders
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/orders")}
              className="gap-2 rounded-xl text-xs font-serif font-bold uppercase tracking-wider border-[#E8D7BE] bg-white text-[#33251F] hover:bg-[#F8EEDC] cursor-pointer"
            >
              <Package className="h-4 w-4 text-[#702C32]" /> View Orders
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logout()}
              className="text-xs text-rose-600 hover:bg-rose-50 rounded-xl gap-1.5 cursor-pointer"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 items-start">
          {/* Left Tabs Menu: Horizontal scrollable pills on mobile, vertical sidebar on md+ */}
          <div className="md:col-span-4 lg:col-span-3 flex flex-row md:flex-col gap-2 overflow-x-auto pb-1 md:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              onClick={() => setActiveTab("profile")}
              className={`shrink-0 md:w-full flex items-center justify-center md:justify-start gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl text-xs font-serif font-bold uppercase tracking-wider transition-all cursor-pointer text-left whitespace-nowrap min-h-[40px] ${
                activeTab === "profile"
                  ? "bg-[#702C32] text-[#F8EEDC] shadow-xs"
                  : "bg-white text-[#33251F] hover:bg-[#F8EEDC]/60 border border-[#E8D7BE]"
              }`}
            >
              <UserIcon className="h-4 w-4 shrink-0" />
              <span>Profile Details</span>
            </button>

            <button
              onClick={() => setActiveTab("addresses")}
              className={`shrink-0 md:w-full flex items-center justify-center md:justify-start gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl text-xs font-serif font-bold uppercase tracking-wider transition-all cursor-pointer text-left whitespace-nowrap min-h-[40px] ${
                activeTab === "addresses"
                  ? "bg-[#702C32] text-[#F8EEDC] shadow-xs"
                  : "bg-white text-[#33251F] hover:bg-[#F8EEDC]/60 border border-[#E8D7BE]"
              }`}
            >
              <MapPin className="h-4 w-4 shrink-0" />
              <span>Addresses ({addresses.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`shrink-0 md:w-full flex items-center justify-center md:justify-start gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl text-xs font-serif font-bold uppercase tracking-wider transition-all cursor-pointer text-left whitespace-nowrap min-h-[40px] ${
                activeTab === "security"
                  ? "bg-[#702C32] text-[#F8EEDC] shadow-xs"
                  : "bg-white text-[#33251F] hover:bg-[#F8EEDC]/60 border border-[#E8D7BE]"
              }`}
            >
              <Lock className="h-4 w-4 shrink-0" />
              <span>Password &amp; Security</span>
            </button>
          </div>

          {/* Right Tab Content */}
          <div className="md:col-span-8 lg:col-span-9">
            {/* Tab 1: Profile */}
            {activeTab === "profile" && (
              <div className="rounded-2xl sm:rounded-3xl border border-[#E8D7BE] bg-white p-4 sm:p-7 shadow-xs space-y-5">
                <h2 className="text-lg sm:text-xl font-bold font-serif text-[#33251F]">
                  Personal Profile
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#F8EEDC]/35 border border-[#E8D7BE]/60">
                    <span className="text-[10px] uppercase tracking-wider text-[#7B685F] font-bold font-serif block">
                      Full Name
                    </span>
                    <p className="text-sm sm:text-base font-bold text-[#33251F] mt-0.5">{user.name}</p>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#F8EEDC]/35 border border-[#E8D7BE]/60">
                    <span className="text-[10px] uppercase tracking-wider text-[#7B685F] font-bold font-serif block">
                      Mobile Number
                    </span>
                    <p className="text-sm sm:text-base font-bold text-[#33251F] mt-0.5">{user.phone}</p>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#F8EEDC]/35 border border-[#E8D7BE]/60 sm:col-span-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#7B685F] font-bold font-serif block">
                      Email Address
                    </span>
                    <p className="text-sm sm:text-base font-bold text-[#33251F] mt-0.5 break-all">{user.email}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E8D7BE]/60 flex items-center gap-2 text-xs text-[#7B685F]">
                  <Shield className="h-4 w-4 text-[#702C32]" />
                  <span>Account Access: <strong className="text-[#33251F] uppercase font-serif">{user.role}</strong></span>
                </div>
              </div>
            )}

            {/* Tab 2: Addresses */}
            {activeTab === "addresses" && (
              <div className="rounded-2xl sm:rounded-3xl border border-[#E8D7BE] bg-white p-4 sm:p-7 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8D7BE]/70">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold font-serif text-[#33251F]">
                      Delivery Addresses
                    </h2>
                    <p className="text-xs text-[#7B685F] mt-0.5">
                      Save shipping locations for faster one-click checkout
                    </p>
                  </div>

                  <Button
                    onClick={() => setShowAddressDialog(true)}
                    size="sm"
                    className="rounded-xl gap-1 text-xs font-serif font-bold uppercase tracking-wider bg-[#702C32] hover:bg-[#551F24] text-[#F8EEDC] self-start sm:self-auto min-h-[36px]"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Address
                  </Button>
                </div>

                {addresses.length === 0 ? (
                  <div className="p-6 sm:p-8 text-center border border-dashed border-[#E8D7BE] rounded-2xl bg-[#F8EEDC]/30">
                    <p className="text-xs sm:text-sm text-[#7B685F] mb-3">
                      No saved addresses found.
                    </p>
                    <Button
                      onClick={() => setShowAddressDialog(true)}
                      size="sm"
                      className="bg-[#702C32] hover:bg-[#551F24] text-[#F8EEDC] text-xs font-serif uppercase tracking-wider min-h-[40px]"
                    >
                      Add Address
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {addresses.map((addr) => (
                      <div
                        key={addr._id}
                        className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all flex flex-col justify-between ${
                          addr.isDefault
                            ? "border-[#702C32] bg-[#F8EEDC]/35"
                            : "border-[#E8D7BE] bg-white"
                        }`}
                      >
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-serif font-bold text-sm text-[#33251F]">
                              {addr.recipientName}
                            </span>
                            <span className="capitalize font-semibold text-[10px] bg-[#EEDEC4] px-2 py-0.5 rounded-full text-[#702C32]">
                              {addr.label}
                            </span>
                          </div>
                          <p className="text-[#33251F]/80 leading-relaxed">
                            {addr.addressLine1}
                            {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                            {addr.landmark ? `, Near ${addr.landmark}` : ""}
                          </p>
                          <p className="text-[#7B685F]">
                            {addr.city}, {addr.state} - {addr.postalCode}
                          </p>
                          <p className="text-[#33251F] font-medium pt-0.5">
                            📞 {addr.phone}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#E8D7BE]/60 flex items-center justify-between">
                          {addr.isDefault ? (
                            <span className="text-[10px] font-bold text-[#536B42] flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" /> Default
                            </span>
                          ) : (
                            <button
                              onClick={() => setDefaultAddress(addr._id)}
                              className="text-[11px] text-[#702C32] font-semibold hover:underline cursor-pointer"
                            >
                              Set as Default
                            </button>
                          )}

                          <button
                            onClick={() => deleteAddress(addr._id)}
                            className="text-[#7B685F] hover:text-rose-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                            aria-label="Delete address"
                          >
                            <Trash2 className="h-4 w-4" />
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
              <div className="rounded-2xl sm:rounded-3xl border border-[#E8D7BE] bg-white p-4 sm:p-7 shadow-xs space-y-5 max-w-lg">
                <h2 className="text-lg sm:text-xl font-bold font-serif text-[#33251F]">
                  Change Password
                </h2>

                <form onSubmit={handleSubmit(onChangePasswordSubmit)} className="space-y-3.5">
                  <div className="space-y-1">
                    <Label className="text-xs font-serif font-bold uppercase tracking-wider text-[#33251F]">
                      Current Password
                    </Label>
                    <Input
                      type="password"
                      {...register("currentPassword")}
                      placeholder="••••••••"
                      error={errors.currentPassword?.message}
                      className="border-[#E8D7BE] text-xs focus:ring-[#702C32]/30"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-serif font-bold uppercase tracking-wider text-[#33251F]">
                      New Password
                    </Label>
                    <Input
                      type="password"
                      {...register("password")}
                      placeholder="At least 8 characters"
                      error={errors.password?.message}
                      className="border-[#E8D7BE] text-xs focus:ring-[#702C32]/30"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-serif font-bold uppercase tracking-wider text-[#33251F]">
                      Confirm New Password
                    </Label>
                    <Input
                      type="password"
                      {...register("confirmPassword")}
                      placeholder="Re-enter new password"
                      error={errors.confirmPassword?.message}
                      className="border-[#E8D7BE] text-xs focus:ring-[#702C32]/30"
                    />
                  </div>

                  <Button
                    type="submit"
                    isLoading={isChangingPassword}
                    className="w-full sm:w-auto rounded-xl font-serif font-bold uppercase tracking-wider text-xs h-10 px-6 bg-[#702C32] hover:bg-[#551F24] text-[#F8EEDC] shadow-md mt-2 cursor-pointer"
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
