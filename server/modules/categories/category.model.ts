import mongoose, {
  Schema,
  type Document,
} from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      maxlength: 500,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.index({
  isActive: 1,
  isDeleted: 1,
});

const Category = mongoose.model<ICategory>(
  "Category",
  categorySchema
);

export default Category;