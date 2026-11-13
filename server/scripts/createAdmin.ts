
import "dotenv/config";

import { z } from "zod";
import argon2 from "argon2";
import { parsePhoneNumberFromString } from "libphonenumber-js";

import { connectDatabase, disconnectDatabase } from "../config/database.js";
import User from "../modules/users/user.model.js";

// Validate temporary admin credentials.
const adminSchema = z.object({
  ADMIN_NAME: z.string().trim().min(2).max(80),

  ADMIN_PHONE: z.string().trim().min(10).max(20),

  ADMIN_EMAIL: z.string().trim().email().max(254),

  ADMIN_PASSWORD: z
    .string()
    .min(12, "Admin password must contain at least 12 characters")
    .max(128)
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number")
    .regex(/[^A-Za-z0-9]/, "Password must contain a special character"),
});

const createAdmin = async (): Promise<void> => {
  let databaseConnected = false;

  try {
    // Step 1: Validate environment credentials.
    const credentials = adminSchema.parse({
      ADMIN_NAME: process.env.ADMIN_NAME,
      ADMIN_PHONE: process.env.ADMIN_PHONE,
      ADMIN_EMAIL: process.env.ADMIN_EMAIL,
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    });

    // Step 2: Normalize phone number.
    const parsedPhone = parsePhoneNumberFromString(
      credentials.ADMIN_PHONE,
      "IN"
    );

    if (!parsedPhone || !parsedPhone.isValid()) {
      throw new Error("Please provide a valid admin phone number.");
    }

    const phone = parsedPhone.number;
    const email = credentials.ADMIN_EMAIL.toLowerCase().trim();

    // Step 3: Connect to MongoDB.
    await connectDatabase();
    databaseConnected = true;

    // Step 4: Refuse to create another administrator.
    const existingAdmin = await User.exists({
      role: { $in: ["admin", "super_admin"] },
    });

    if (existingAdmin) {
      throw new Error(
        "An administrator already exists. Seed operation cancelled."
      );
    }

    // Step 5: Check for existing phone or email.
    const existingUser = await User.findOne({
      $or: [
        { phone },
        { email },
      ],
    }).select("_id phone email");

    if (existingUser) {
      throw new Error(
        "This phone number or email already belongs to an existing account. No account was modified."
      );
    }

    // Step 6: Hash the admin password.
    const hashedPassword = await argon2.hash(
      credentials.ADMIN_PASSWORD,
      {
        type: argon2.argon2id,
      }
    );

    // Step 7: Create administrator.
    const admin = await User.create({
      name: credentials.ADMIN_NAME,
      phone,
      email,
      password: hashedPassword,
      role: "super_admin",
      isActive: true,
      authVersion: 0,
    });

    console.log("--------------------------------");
    console.log("MAGHORA ADMIN CREATED");
    console.log("--------------------------------");
    console.log(`Name: ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Phone: ${admin.phone}`);
    console.log(`Role: ${admin.role}`);
    console.log(`Admin ID: ${admin._id}`);
    console.log("--------------------------------");
    console.log("Password stored securely using Argon2id.");
    console.log("Do not share these credentials.");
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(
        "Invalid admin configuration:",
        error.issues.map((issue) => issue.message)
      );
    } else if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      console.error(
        "Admin creation failed: Duplicate phone number or email."
      );
    } else {
      console.error(
        "Admin creation failed:",
        error instanceof Error ? error.message : "Unknown error"
      );
    }

    process.exitCode = 1;
  } finally {
    // Step 8: Close database connection.
    if (databaseConnected) {
      await disconnectDatabase().catch((error) => {
        console.error("Database disconnection failed:", error);
        process.exitCode = 1;
      });
    }
  }
};

void createAdmin();
