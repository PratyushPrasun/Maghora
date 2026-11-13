
import argon2 from "argon2";
import { parsePhoneNumberFromString } from "libphonenumber-js";

import User from "../users/user.model.js";

const normalizePhone = (phone: string): string => {
  const parsed = parsePhoneNumberFromString(phone, "IN");

  if (!parsed || !parsed.isValid()) {
    throw Object.assign(
      new Error("Please enter a valid mobile number"),
      { statusCode: 400 }
    );
  }

  return parsed.number;
};

export const registerUser = async (data: {
  name: string;
  phone: string;
  email: string;
  password: string;
}) => {
  const phone = normalizePhone(data.phone);
  const email = data.email.trim().toLowerCase();

  const existingUser = await User.findOne({
    $or: [{ phone }, { email }],
  });

  if (existingUser) {
    throw Object.assign(
      new Error("Phone number or email is already registered"),
      { statusCode: 409 }
    );
  }

  const hashedPassword = await argon2.hash(data.password, {
    type: argon2.argon2id,
  });

  const user = await User.create({
    name: data.name.trim(),
    phone,
    email,
    password: hashedPassword,
    role: "customer",
  });

  return user;
};

export const loginUser = async (
  identifier: string,
  password: string
) => {
  const normalizedIdentifier = identifier.trim();

  const isEmail = normalizedIdentifier.includes("@");

  const query = isEmail
    ? { email: normalizedIdentifier.toLowerCase() }
    : { phone: normalizePhone(normalizedIdentifier) };

  const user = await User.findOne(query).select("+password +authVersion");

  if (!user) {
    throw Object.assign(
      new Error("Invalid login credentials"),
      { statusCode: 401 }
    );
  }

  if (!user.isActive) {
    throw Object.assign(
      new Error("Your account is currently inactive"),
      { statusCode: 403 }
    );
  }

  const passwordMatches = await argon2.verify(
    user.password,
    password
  );

  if (!passwordMatches) {
    throw Object.assign(
      new Error("Invalid login credentials"),
      { statusCode: 401 }
    );
  }

  return user;
};

export const serializeUser = (user: {
  _id: unknown;
  name: string;
  phone: string;
  email: string;
  role: string;
  isActive: boolean;
}) => ({
  id: String(user._id),
  name: user.name,
  phone: user.phone,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
});