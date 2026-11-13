
import mongoose from "mongoose";
import argon2 from "argon2";
import { parsePhoneNumberFromString } from "libphonenumber-js";

import User from "../users/user.model.js";
import AdminAudit from "./admin-audit.model.js";

const normalizePhone = (value: string): string => {
  const parsed = parsePhoneNumberFromString(value, "IN");

  if (!parsed || !parsed.isValid()) {
    throw Object.assign(
      new Error("Please enter a valid phone number"),
      { statusCode: 400 }
    );
  }

  return parsed.number;
};

const getAdminOrThrow = async (
  id: string,
  session: mongoose.ClientSession
) => {
  if (!mongoose.isValidObjectId(id)) {
    throw Object.assign(
      new Error("Invalid administrator ID"),
      { statusCode: 400 }
    );
  }

const admin = await User.findById(id)
  .select("+authVersion")
  .session(session);

  if (!admin || admin.role !== "admin") {
    throw Object.assign(
      new Error("Administrator not found"),
      { statusCode: 404 }
    );
  }

  return admin;
};

// Create a normal administrator.
export const createAdmin = async (
  actor: { _id: mongoose.Types.ObjectId; email: string },
  data: {
    name: string;
    phone: string;
    email: string;
    password: string;
  }
) => {
  const phone = normalizePhone(data.phone);
  const email = data.email.trim().toLowerCase();

  const hashedPassword = await argon2.hash(data.password, {
    type: argon2.argon2id,
  });

  const session = await mongoose.startSession();

  let createdAdmin: InstanceType<typeof User> | null = null;

  try {
    await session.withTransaction(async () => {
      const existingUser = await User.findOne({
        $or: [{ phone }, { email }],
      }).session(session);

      if (existingUser) {
        throw Object.assign(
          new Error("Phone number or email is already registered"),
          { statusCode: 409 }
        );
      }

      const [admin] = await User.create(
        [
          {
            name: data.name.trim(),
            phone,
            email,
            password: hashedPassword,
            role: "admin",
            isActive: true,
            authVersion: 0,
          },
        ],
        { session }
      );

      await AdminAudit.create(
        [
          {
            actorId: actor._id,
            actorEmail: actor.email,
            targetUserId: admin._id,
            targetEmail: admin.email,
            action: "ADMIN_CREATED",
            changes: {
              name: admin.name,
              phone: admin.phone,
              email: admin.email,
            },
          },
        ],
        { session }
      );

      createdAdmin = admin;
    });
  } finally {
    await session.endSession();
  }

  if (!createdAdmin) {
    throw new Error("Administrator creation failed");
  }

  return createdAdmin;
};

// List normal administrators.
export const listAdmins = async (
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit;

  const [admins, total] = await Promise.all([
    User.find({ role: "admin" })
      .select(
        "name phone email role isActive createdAt updatedAt"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    User.countDocuments({ role: "admin" }),
  ]);

  return {
    admins,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Update normal administrator details.
export const updateAdmin = async (
  actor: { _id: mongoose.Types.ObjectId; email: string },
  id: string,
  data: {
    name?: string;
    phone?: string;
    email?: string;
  }
) => {
  const session = await mongoose.startSession();

  let updatedAdmin: InstanceType<typeof User> | null = null;

  try {
    await session.withTransaction(async () => {
      const admin = await getAdminOrThrow(id, session);

      const changes: Record<string, unknown> = {};

      if (data.name !== undefined) {
        changes.name = data.name.trim();
      }

      if (data.phone !== undefined) {
        changes.phone = normalizePhone(data.phone);
      }

      if (data.email !== undefined) {
        changes.email = data.email.trim().toLowerCase();
      }

      const newPhone = changes.phone ?? admin.phone;
      const newEmail = changes.email ?? admin.email;

      const duplicate = await User.findOne({
        _id: { $ne: admin._id },
        $or: [
          { phone: newPhone },
          { email: newEmail },
        ],
      }).session(session);

      if (duplicate) {
        throw Object.assign(
          new Error("Phone number or email is already in use"),
          { statusCode: 409 }
        );
      }

      admin.set(changes);

      await admin.save({ session });

      await AdminAudit.create(
        [
          {
            actorId: actor._id,
            actorEmail: actor.email,
            targetUserId: admin._id,
            targetEmail: admin.email,
            action: "ADMIN_UPDATED",
            changes,
          },
        ],
        { session }
      );

      updatedAdmin = admin;
    });
  } finally {
    await session.endSession();
  }

  if (!updatedAdmin) {
    throw new Error("Administrator update failed");
  }

  return updatedAdmin;
};

// Activate or deactivate a normal administrator.
export const updateAdminStatus = async (
  actor: { _id: mongoose.Types.ObjectId; email: string },
  id: string,
  isActive: boolean
) => {
  const session = await mongoose.startSession();

  let updatedAdmin: InstanceType<typeof User> | null = null;

  try {
    await session.withTransaction(async () => {
      const admin = await getAdminOrThrow(id, session);

      if (admin.isActive === isActive) {
        updatedAdmin = admin;
        return;
      }

      admin.isActive = isActive;

      // Revoke all existing sessions for this administrator.
      admin.authVersion += 1;

      await admin.save({ session });

      await AdminAudit.create(
        [
          {
            actorId: actor._id,
            actorEmail: actor.email,
            targetUserId: admin._id,
            targetEmail: admin.email,
            action: isActive
              ? "ADMIN_ACTIVATED"
              : "ADMIN_DEACTIVATED",
            changes: {
              isActive,
            },
          },
        ],
        { session }
      );

      updatedAdmin = admin;
    });
  } finally {
    await session.endSession();
  }

  if (!updatedAdmin) {
    throw new Error("Administrator status update failed");
  }

  return updatedAdmin;
};

// Read administrator audit history.
export const listAdminAuditLogs = async (
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    AdminAudit.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    AdminAudit.countDocuments(),
  ]);

  return {
    logs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
