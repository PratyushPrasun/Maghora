import mongoose from "mongoose";

import Address from "./address.model.js";
import { ApiError } from "../../utils/ApiError.js";

export async function createAddress(
  userId: string,
  data: Record<string, any>
) {
  const existingCount = await Address.countDocuments({
    userId,
  });

  if (existingCount >= 20) {
    throw new ApiError(
      400,
      "You can save a maximum of 20 addresses"
    );
  }

  const shouldBeDefault =
    data.isDefault || existingCount === 0;

  if (shouldBeDefault) {
    await Address.updateMany(
      { userId, isDefault: true },
      { $set: { isDefault: false } }
    );
  }

  const address = await Address.create({
    ...data,
    userId,
    isDefault: shouldBeDefault,
  });

  return address;
}

export async function getAddresses(userId: string) {
  return Address.find({ userId })
    .sort({ isDefault: -1, createdAt: -1 })
    .lean();
}

export async function getAddressById(
  userId: string,
  addressId: string
) {
  if (!mongoose.isValidObjectId(addressId)) {
    throw new ApiError(400, "Invalid address ID");
  }

  const address = await Address.findOne({
    _id: addressId,
    userId,
  });

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  return address;
}

export async function updateAddress(
  userId: string,
  addressId: string,
  data: Record<string, any>
) {
  if (!mongoose.isValidObjectId(addressId)) {
    throw new ApiError(400, "Invalid address ID");
  }

  const address = await Address.findOne({
    _id: addressId,
    userId,
  });

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  if (data.isDefault === true) {
    await Address.updateMany(
      { userId, isDefault: true },
      { $set: { isDefault: false } }
    );
  }

  address.set(data);
  await address.save();

  return address;
}

export async function setDefaultAddress(
  userId: string,
  addressId: string
) {
  if (!mongoose.isValidObjectId(addressId)) {
    throw new ApiError(400, "Invalid address ID");
  }

  const target = await Address.findOne({
    _id: addressId,
    userId,
  });

  if (!target) {
    throw new ApiError(404, "Address not found");
  }

  await Address.updateMany(
    { userId, isDefault: true },
    { $set: { isDefault: false } }
  );

  target.isDefault = true;
  await target.save();

  return target;
}

export async function deleteAddress(
  userId: string,
  addressId: string
) {
  if (!mongoose.isValidObjectId(addressId)) {
    throw new ApiError(400, "Invalid address ID");
  }

  const result = await Address.deleteOne({
    _id: addressId,
    userId,
  });

  if (result.deletedCount === 0) {
    throw new ApiError(404, "Address not found");
  }

  return {
    message: "Address deleted successfully",
  };
}