import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
} from "./address.service.js";

function getUserId(req: Request): string {
  if (!req.currentUser) {
    throw new Error("Authenticated user not found");
  }

  return req.currentUser._id.toString();
}

export async function createMyAddress(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const address = await createAddress(
      getUserId(req),
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Address saved successfully",
      data: address,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyAddresses(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const addresses = await getAddresses(getUserId(req));

    res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyAddressById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const addressId = req.params.addressId;

    if (typeof addressId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID",
      });
    }

    const address = await getAddressById(
      getUserId(req),
      addressId
    );

    res.status(200).json({
      success: true,
      data: address,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateMyAddress(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const addressId = req.params.addressId;

    if (typeof addressId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID",
      });
    }

    const address = await updateAddress(
      getUserId(req),
      addressId,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: address,
    });
  } catch (error) {
    next(error);
  }
}

export async function makeDefaultAddress(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const addressId = req.params.addressId;

    if (typeof addressId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID",
      });
    }

    const address = await setDefaultAddress(
      getUserId(req),
      addressId
    );

    res.status(200).json({
      success: true,
      message: "Default address updated",
      data: address,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteMyAddress(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const addressId = req.params.addressId;

    if (typeof addressId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID",
      });
    }

    const result = await deleteAddress(
      getUserId(req),
      addressId
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}