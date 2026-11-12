
import mongoose, { Schema, type Document, Types } from "mongoose";

export interface IPasswordReset extends Document {
  userId: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
}

const passwordResetSchema = new Schema<IPasswordReset>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

passwordResetSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

passwordResetSchema.index({ userId: 1 });

const PasswordReset = mongoose.model<IPasswordReset>(
  "PasswordReset",
  passwordResetSchema
);

export default PasswordReset;
