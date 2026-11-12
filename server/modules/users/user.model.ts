
import mongoose, { Schema, type Document } from "mongoose";

export type UserRole =
  | "customer"
  | "admin"
  | "super_admin";

export interface IUser extends Document {
  name: string;
  phone: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  mustChangePassword: boolean;
  authVersion: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["customer", "admin", "super_admin"],
      default: "customer",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    mustChangePassword: {
      type: Boolean,
      default: false,
    },

    authVersion: {
      type: Number,
      default: 0,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
