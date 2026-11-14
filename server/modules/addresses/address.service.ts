import mongoose from "mongoose";

import Address from "./address.model.js";

function createError(message: string, statusCode: number) {
  return Object.assign(new Error(message), { statusCode });
}

export async function createAddress(
  userId: string,
  data: Record<string, any>
) {
  const session = await mongoose.startSession();

  try {
    let address: any;

    await session.withTransaction(async () => {
      const existingCount = await Address.countDocuments({
        userId,
      }).session(session);

      if (existingCount >= 20) {
        throw createError(
          "You can save a maximum of 20 addresses",
          400
        );
      }

      const shouldBeDefault =
        data.isDefault || existingCount === 0;

      if (shouldBeDefault) {
        await Address.updateMany(
          { userId, isDefault: true },
          { $set: { isDefault: false } },
          { session }
        );
      }

      const [created] = await Address.create(
        [{
          ...data,
          userId,
          isDefault: shouldBeDefault,
        }],
        { session }
      );

      address = created;
    });

    return address;
  } finally {
    await session.endSession();
  }
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
    throw createError("Invalid address ID", 400);
  }

  const address = await Address.findOne({
    _id: addressId,
    userId,
  });

  if (!address) {
    throw createError("Address not found", 404);
  }

  return address;
}

export async function updateAddress(
  userId: string,
  addressId: string,
  data: Record<string, any>
) {
  if (!mongoose.isValidObjectId(addressId)) {
    throw createError("Invalid address ID", 400);
  }

  const session = await mongoose.startSession();

  try {
    let updatedAddress: any;

    await session.withTransaction(async () => {
      const address = await Address.findOne({
        _id: addressId,
        userId,
      }).session(session);

      if (!address) {
        throw createError("Address not found", 404);
      }

      if (data.isDefault === true) {
        await Address.updateMany(
          { userId, isDefault: true },
          { $set: { isDefault: false } },
          { session }
        );
      }

      address.set(data);

      await address.save({ session });

      updatedAddress = address;
    });

    return updatedAddress;
  } finally {
    await session.endSession();
  }
}

export async function setDefaultAddress(
  userId: string,
  addressId: string
) {
  if (!mongoose.isValidObjectId(addressId)) {
    throw createError("Invalid address ID", 400);
  }

  const session = await mongoose.startSession();

  try {
    let address: any;

    await session.withTransaction(async () => {
      const target = await Address.findOne({
        _id: addressId,
        userId,
      }).session(session);

      if (!target) {
        throw createError("Address not found", 404);
      }

      await Address.updateMany(
        { userId, isDefault: true },
        { $set: { isDefault: false } },
        { session }
      );

      target.isDefault = true;

      await target.save({ session });

      address = target;
    });

    return address;
  } finally {
    await session.endSession();
  }
}

export async function deleteAddress(
  userId: string,
  addressId: string
) {
  if (!mongoose.isValidObjectId(addressId)) {
    throw createError("Invalid address ID", 400);
  }

  const result = await Address.deleteOne({
    _id: addressId,
    userId,
  });

  if (result.deletedCount === 0) {
    throw createError("Address not found", 404);
  }

  return {
    message: "Address deleted successfully",
  };
}