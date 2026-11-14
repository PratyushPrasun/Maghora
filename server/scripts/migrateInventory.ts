import "dotenv/config";
import mongoose from "mongoose";

import { connectDatabase } from "../config/database.js";

async function migrateInventory() {
  await connectDatabase();

  const products = await mongoose.connection
    .collection("products")
    .find({})
    .toArray();

  const operations = [];

  for (const product of products) {
    const variants = product.variants ?? {};

    for (let index = 0; index < variants.length; index++) {
      const variant = variants[index];

      operations.push({
        updateOne: {
          filter: { _id: product._id },
          update: {
            $set: {
              [`variants.${index}.stockOnHand`]:
                variant.stockOnHand ?? variant.stock ?? 0,
              [`variants.${index}.reservedStock`]:
                variant.reservedStock ?? 0,
            },
            $unset: {
              [`variants.${index}.stock`]: "",
            },
          },
        },
      });
    }
  }

  if (operations.length > 0) {
    await mongoose.connection
      .collection("products")
      .bulkWrite(operations);
  }

  console.log("Inventory migration completed.");

  await mongoose.disconnect();
}

migrateInventory().catch(async (error) => {
  console.error("Inventory migration failed:", error);
  await mongoose.disconnect();
  process.exit(1);
});