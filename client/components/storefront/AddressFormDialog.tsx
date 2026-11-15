"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddresses } from "@/hooks/useAddresses";
import { CreateAddressPayload } from "@/services/addresses.service";

const addressFormSchema = z.object({
  recipientName: z.string().trim().min(2, "Name must be at least 2 characters"),
  phone: z.string().trim().regex(/^\+?[0-9]{10,15}$/, "Enter a valid 10-15 digit phone number"),
  addressLine1: z.string().trim().min(5, "Address must be at least 5 characters"),
  addressLine2: z.string().trim().optional(),
  landmark: z.string().trim().optional(),
  city: z.string().trim().min(2, "City is required"),
  state: z.string().trim().min(2, "State is required"),
  postalCode: z.string().regex(/^[0-9]{6}$/, "Enter a valid 6-digit Indian PIN code"),
  label: z.enum(["home", "office", "other"]),
  customLabel: z.string().trim().optional(),
  isDefault: z.boolean(),
});

type FormValues = z.infer<typeof addressFormSchema>;

interface AddressFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (addressId: string) => void;
}

export function AddressFormDialog({ open, onOpenChange, onSuccess }: AddressFormDialogProps) {
  const { createAddress, isCreating } = useAddresses();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      label: "home",
      isDefault: true,
      addressLine2: "",
      landmark: "",
      customLabel: "",
    },
  });

  const selectedLabel = watch("label");

  const onSubmit = async (values: FormValues) => {
    const payload: CreateAddressPayload = {
      label: values.label,
      customLabel: values.label === "other" ? values.customLabel : undefined,
      recipientName: values.recipientName,
      phone: values.phone,
      addressLine1: values.addressLine1,
      addressLine2: values.addressLine2 || "",
      landmark: values.landmark || "",
      city: values.city,
      state: values.state,
      postalCode: values.postalCode,
      country: "India",
      isDefault: values.isDefault,
    };

    const newAddress = await createAddress(payload);
    reset();
    onOpenChange(false);
    if (onSuccess && newAddress?._id) {
      onSuccess(newAddress._id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Delivery Address</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Full Name *</Label>
              <Input
                {...register("recipientName")}
                placeholder="Rohit Sharma"
                error={errors.recipientName?.message}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Mobile Number *</Label>
              <Input
                {...register("phone")}
                placeholder="9876543210"
                error={errors.phone?.message}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Flat, House no., Building, Street *</Label>
            <Input
              {...register("addressLine1")}
              placeholder="Flat 402, Lotus Residency, 4th Cross"
              error={errors.addressLine1?.message}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Area / Landmark</Label>
              <Input {...register("landmark")} placeholder="Near Central Park" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">6-Digit PIN Code *</Label>
              <Input
                {...register("postalCode")}
                placeholder="560001"
                error={errors.postalCode?.message}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">City *</Label>
              <Input
                {...register("city")}
                placeholder="Bengaluru"
                error={errors.city?.message}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">State *</Label>
              <Input
                {...register("state")}
                placeholder="Karnataka"
                error={errors.state?.message}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Address Type</Label>
            <div className="flex gap-2">
              {(["home", "office", "other"] as const).map((l) => (
                <label
                  key={l}
                  className={`flex-1 flex items-center justify-center py-2 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                    selectedLabel === l
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground"
                  }`}
                >
                  <input
                    type="radio"
                    value={l}
                    {...register("label")}
                    className="sr-only"
                  />
                  <span className="capitalize">{l}</span>
                </label>
              ))}
            </div>
          </div>

          {selectedLabel === "other" && (
            <div className="space-y-1">
              <Label className="text-xs">Custom Label *</Label>
              <Input
                {...register("customLabel")}
                placeholder="e.g. Studio, Gym, Parents"
                error={errors.customLabel?.message}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isCreating}>
              Save Address
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
