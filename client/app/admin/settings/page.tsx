"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Settings,
  Shield,
  UserPlus,
  Lock,
  History,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  useAdmins,
  useAdminAuditLogs,
  useCreateAdmin,
  useUpdateAdminStatus,
} from "@/hooks/useAdmin";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password required"),
    password: z.string().min(8, "Minimum 8 characters").max(128),
    confirmPassword: z.string().min(8, "Confirm password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const inviteAdminSchema = z.object({
  name: z.string().trim().min(2, "Name required").max(80),
  phone: z.string().trim().min(10, "Valid phone required").max(20),
  email: z.string().trim().email("Valid email required"),
  password: z.string().min(12, "Admin password must contain at least 12 characters"),
});

export default function AdminSettingsPage() {
  const { user, isSuperAdmin } = useAuth();
  const { data: adminsData, isLoading: loadingAdmins } = useAdmins(1, 20);
  const { data: auditData, isLoading: loadingAudit } = useAdminAuditLogs(1, 20);
  const createAdminMutation = useCreateAdmin();
  const updateStatusMutation = useUpdateAdminStatus();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const {
    register: regPass,
    handleSubmit: handlePassSubmit,
    reset: resetPass,
    formState: { errors: passErrors },
  } = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
  });

  const {
    register: regInvite,
    handleSubmit: handleInviteSubmit,
    reset: resetInvite,
    formState: { errors: inviteErrors },
  } = useForm<z.infer<typeof inviteAdminSchema>>({
    resolver: zodResolver(inviteAdminSchema),
  });

  const onChangePassword = async (data: z.infer<typeof changePasswordSchema>) => {
    try {
      setIsChangingPassword(true);
      await authService.changePassword(data);
      resetPass();
      toast.success("Admin password updated successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const onInviteAdmin = async (data: z.infer<typeof inviteAdminSchema>) => {
    try {
      await createAdminMutation.mutateAsync(data);
      resetInvite();
      setIsInviteOpen(false);
    } catch {
      // Handled in mutation
    }
  };

  const handleToggleAdminStatus = async (id: string, current: boolean) => {
    await updateStatusMutation.mutateAsync({ id, isActive: !current });
  };

  return (
    <div className="space-y-8 max-w-5xl pb-16">
      {/* Header */}
      <div className="pb-6 border-b border-border">
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
          System & Account Settings
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Manage your credentials, team authorizations, and administrative security logs
        </p>
      </div>

      {/* Account Info & Password Change */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Card */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-foreground pb-2 border-b border-border/60">
            Administrator Profile
          </h2>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-secondary/30 rounded-xl">
              <span className="text-muted-foreground">Name:</span>
              <p className="font-bold text-foreground text-sm">{user?.name}</p>
            </div>

            <div className="p-3 bg-secondary/30 rounded-xl">
              <span className="text-muted-foreground">Email:</span>
              <p className="font-bold text-foreground text-sm">{user?.email}</p>
            </div>

            <div className="p-3 bg-secondary/30 rounded-xl">
              <span className="text-muted-foreground">Assigned Role:</span>
              <p className="font-bold text-primary text-sm uppercase">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-foreground pb-2 border-b border-border/60">
            Update Admin Password
          </h2>

          <form onSubmit={handlePassSubmit(onChangePassword)} className="space-y-3 text-xs">
            <div className="space-y-1">
              <Label className="text-[11px]">Current Password</Label>
              <Input
                type="password"
                {...regPass("currentPassword")}
                error={passErrors.currentPassword?.message}
                className="h-9"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-[11px]">New Password</Label>
              <Input
                type="password"
                {...regPass("password")}
                error={passErrors.password?.message}
                className="h-9"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-[11px]">Confirm New Password</Label>
              <Input
                type="password"
                {...regPass("confirmPassword")}
                error={passErrors.confirmPassword?.message}
                className="h-9"
              />
            </div>

            <Button
              type="submit"
              size="sm"
              isLoading={isChangingPassword}
              className="mt-2 rounded-xl"
            >
              Update Password
            </Button>
          </form>
        </div>
      </div>

      {/* Super Admin Team Section */}
      {isSuperAdmin && (
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
            <div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold font-serif text-foreground">
                  Team Members & Administrators
                </h2>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Super Admin control: Provision and manage operational permissions
              </p>
            </div>

            <Button
              onClick={() => setIsInviteOpen(true)}
              size="sm"
              className="rounded-xl gap-1 text-xs"
            >
              <UserPlus className="h-3.5 w-3.5" /> Add Staff Member
            </Button>
          </div>

          {/* Admins Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 text-muted-foreground uppercase tracking-wider text-[11px] font-bold">
                <tr>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Contact</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {adminsData?.admins?.map((adm) => (
                  <tr key={adm.id} className="hover:bg-muted/20">
                    <td className="py-3 px-3 font-bold text-foreground">{adm.name}</td>
                    <td className="py-3 px-3 text-muted-foreground">{adm.email}</td>
                    <td className="py-3 px-3 uppercase font-semibold text-primary">{adm.role}</td>
                    <td className="py-3 px-3">
                      <Badge variant={adm.isActive ? "success" : "outline"}>
                        {adm.isActive ? "Active" : "Disabled"}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleAdminStatus(adm.id, adm.isActive)}
                        className="h-7 text-[11px]"
                      >
                        {adm.isActive ? "Deactivate" : "Activate"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Audit Trail */}
          <div className="pt-6 border-t border-border/60 space-y-3">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Recent Audit Trail (Immutable MongoDB Log)
              </h3>
            </div>

            <div className="max-h-56 overflow-y-auto divide-y divide-border/40 text-xs text-muted-foreground">
              {auditData?.logs?.slice(0, 5).map((log) => (
                <div key={log._id} className="py-2 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-foreground">{log.action}</span>: {log.targetEmail}
                    <span className="text-[10px] text-muted-foreground block">
                      Actor: {log.actorEmail}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono">{formatDate(log.createdAt)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Invite Admin Dialog */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent onClose={() => setIsInviteOpen(false)}>
          <DialogHeader>
            <DialogTitle>Invite New Administrator</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleInviteSubmit(onInviteAdmin)} className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs">Full Name *</Label>
              <Input {...regInvite("name")} error={inviteErrors.name?.message} />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Mobile Number *</Label>
              <Input {...regInvite("phone")} error={inviteErrors.phone?.message} />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Email Address *</Label>
              <Input type="email" {...regInvite("email")} error={inviteErrors.email?.message} />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Temporary Password (min 12 chars) *</Label>
              <Input
                type="password"
                {...regInvite("password")}
                error={inviteErrors.password?.message}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsInviteOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={createAdminMutation.isPending}>
                Create Staff Account
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

