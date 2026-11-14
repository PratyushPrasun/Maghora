import { Router } from "express";

import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { validate } from "../../middlewares/validate.js";

import {
  createAddressSchema,
  updateAddressSchema,
} from "./address.validation.js";

import {
  createMyAddress,
  getMyAddresses,
  getMyAddressById,
  updateMyAddress,
  makeDefaultAddress,
  deleteMyAddress,
} from "./address.controller.js";

const router = Router();

router.use(authenticate);
router.use(authorize("customer"));

router.post(
  "/",
  validate(createAddressSchema),
  createMyAddress
);

router.get("/", getMyAddresses);

router.get("/:addressId", getMyAddressById);

router.patch(
  "/:addressId",
  validate(updateAddressSchema),
  updateMyAddress
);

router.patch(
  "/:addressId/default",
  makeDefaultAddress
);

router.delete("/:addressId", deleteMyAddress);

export default router;
