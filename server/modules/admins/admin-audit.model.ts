
import mongoose, { Schema, type Document } from "mongoose";

export type AdminAuditAction =
  | "ADMIN_CREATED"
  | "ADMIN_UPDATED"
  | "ADMIN_ACTIVATED"
  | "ADMIN_DEACTIVATED";

export interface IAdminAudit extends Document {
  actorId: mongoose.Types.ObjectId;
  actorEmail: string;

  targetUserId: mongoose.Types.ObjectId;
  targetEmail: string;

  action: AdminAuditAction;

  changes?: Record<string, unknown>;

  createdAt: Date;
}

const adminAuditSchema = new Schema<IAdminAudit>(
  {
    actorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    actorEmail: {
      type: String,
      required: true,
    },

    targetUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    targetEmail: {
      type: String,
      required: true,
    },

    action: {
      type: String,
      enum: [
        "ADMIN_CREATED",
        "ADMIN_UPDATED",
        "ADMIN_ACTIVATED",
        "ADMIN_DEACTIVATED",
      ],
      required: true,
    },

    changes: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

adminAuditSchema.index({ createdAt: -1 });
adminAuditSchema.index({ actorId: 1, createdAt: -1 });
adminAuditSchema.index({ targetUserId: 1, createdAt: -1 });

const AdminAudit = mongoose.model<IAdminAudit>(
  "AdminAudit",
  adminAuditSchema
);

export default AdminAudit;
