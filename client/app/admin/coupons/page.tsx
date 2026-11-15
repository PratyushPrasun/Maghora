"use client";

import React, { useState } from "react";
import { Ticket, Plus, Tag, CheckCircle2, AlertCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrderPaise: number;
  status: "active" | "expired";
  usageCount: number;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: "1",
      code: "MAGHORA10",
      type: "percentage",
      value: 10,
      minOrderPaise: 49900,
      status: "active",
      usageCount: 42,
    },
    {
      id: "2",
      code: "WELCOME",
      type: "fixed",
      value: 50,
      minOrderPaise: 29900,
      status: "active",
      usageCount: 18,
    },
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [code, setCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(10);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setCoupons([
      ...coupons,
      {
        id: Date.now().toString(),
        code: code.trim().toUpperCase(),
        type: "percentage",
        value: Number(discountPercent),
        minOrderPaise: 49900,
        status: "active",
        usageCount: 0,
      },
    ]);

    toast.success(`Coupon ${code.toUpperCase()} registered in local integration layer!`);
    setIsAddOpen(false);
    setCode("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
            Coupons & Promotional Vouchers
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Configure checkout discount codes and promotional campaigns
          </p>
        </div>

        <Button onClick={() => setIsAddOpen(true)} className="rounded-xl font-bold gap-2 text-xs">
          <Plus className="h-4 w-4" /> Create Coupon
        </Button>
      </div>

      {/* Integration Status Notice */}
      <div className="p-4 rounded-2xl bg-secondary/30 border border-border text-xs text-foreground/80 flex items-start gap-3">
        <AlertCircle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-foreground">Backend Module Notice: </strong>
          The server backend currently lacks a persistent MongoDB coupon collection. This frontend interface is pre-wired with typed contracts and local state adapter ready to plug into the backend once the coupon service is provisioned.
        </div>
      </div>

      {/* Coupons Table */}
      <div className="rounded-3xl border border-border bg-card shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground uppercase tracking-wider text-[11px] font-bold">
            <tr>
              <th className="py-3.5 px-4">Coupon Code</th>
              <th className="py-3.5 px-4">Discount Type</th>
              <th className="py-3.5 px-4">Min Order Value</th>
              <th className="py-3.5 px-4 text-center">Times Used</th>
              <th className="py-3.5 px-4">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border/60">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                <td className="py-3.5 px-4">
                  <span className="font-mono font-bold text-sm bg-secondary px-2.5 py-1 rounded-lg text-secondary-foreground">
                    {c.code}
                  </span>
                </td>

                <td className="py-3.5 px-4 font-semibold text-foreground">
                  {c.type === "percentage" ? `${c.value}% Off` : `Flat ₹${c.value} Off`}
                </td>

                <td className="py-3.5 px-4 text-muted-foreground">
                  ₹{c.minOrderPaise / 100}
                </td>

                <td className="py-3.5 px-4 text-center font-bold text-foreground">
                  {c.usageCount}
                </td>

                <td className="py-3.5 px-4">
                  <Badge variant={c.status === "active" ? "success" : "outline"}>
                    {c.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent onClose={() => setIsAddOpen(false)}>
          <DialogHeader>
            <DialogTitle>Create Promotional Coupon</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs">Coupon Code *</Label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. CRUNCH20"
                className="uppercase font-mono"
                required
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Discount Percentage (%) *</Label>
              <Input
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                min={1}
                max={100}
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Coupon</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

