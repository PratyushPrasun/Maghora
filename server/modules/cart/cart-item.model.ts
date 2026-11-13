import mongoose, { Schema, Types } from "mongoose";

export interface ICartItem {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  variantId: Types.ObjectId;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    variantId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
    },
  },
  {
    timestamps: true,
  }
);

// A user can have only one cart line per variant.
cartItemSchema.index(
  { userId: 1, variantId: 1 },
  { unique: true }
);

cartItemSchema.index({ userId: 1, createdAt: -1 });

const CartItem = mongoose.model<ICartItem>(
  "CartItem",
  cartItemSchema
);

export default CartItem;
