
import type { Request, Response } from "express";

import {
  createAdmin as createAdminService,
  listAdmins as listAdminsService,
  updateAdmin as updateAdminService,
  updateAdminStatus as updateAdminStatusService,
  listAdminAuditLogs,
} from "./admin.service.js";

import {
  serializeUser,
} from "../auth/auth.service.js";

// Create administrator.
export const createAdmin = async (
  req: Request,
  res: Response
) => {
  const actor = req.currentUser!;

  const admin = await createAdminService(actor, req.body);

  return res.status(201).json({
    success: true,
    message: "Administrator created successfully.",
    data: {
      admin: serializeUser(admin),
    },
  });
};
// List administrators.
export const getAdmins = async (
  req: Request,
  res: Response
) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const result = await listAdminsService(page, limit);

  return res.status(200).json({
    success: true,
    data: result,
  });
};

// Update administrator details.
export const updateAdmin = async (
  req: Request,
  res: Response
) => {
  const adminId = req.params.id;

if (typeof adminId !== "string") {
  return res.status(400).json({
    success: false,
    message: "Invalid administrator ID",
  });
}

const admin = await updateAdminService(
  req.currentUser!,
  adminId,
  req.body
);

  return res.status(200).json({
    success: true,
    message: "Administrator updated successfully",
    data: {
      admin: serializeUser(admin),
    },
  });
};

// Activate/deactivate administrator.
export const updateAdminStatus = async (
  req: Request,
  res: Response
) => {
  const adminId = req.params.id;

if (typeof adminId !== "string") {
  return res.status(400).json({
    success: false,
    message: "Invalid administrator ID",
  });
}

const admin = await updateAdminStatusService(
  req.currentUser!,
  adminId,
  req.body.isActive
);

  return res.status(200).json({
    success: true,
    message: "Administrator status updated successfully",
    data: {
      admin: serializeUser(admin),
    },
  });
};

// Get admin audit logs.
export const getAdminAuditLogs = async (
  req: Request,
  res: Response
) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const result = await listAdminAuditLogs(page, limit);

  return res.status(200).json({
    success: true,
    data: result,
  });
};
