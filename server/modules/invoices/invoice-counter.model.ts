import mongoose, { Schema } from "mongoose";

export interface IInvoiceCounter {
  _id: string;
  prefix: string;
  financialYear: string;
  seq: number;
}

const invoiceCounterSchema = new Schema<IInvoiceCounter>(
  {
    _id: {
      type: String,
      required: true,
    },
    prefix: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    financialYear: {
      type: String,
      required: true,
      trim: true,
    },
    seq: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

const InvoiceCounter = mongoose.model<IInvoiceCounter>(
  "InvoiceCounter",
  invoiceCounterSchema
);

export default InvoiceCounter;
