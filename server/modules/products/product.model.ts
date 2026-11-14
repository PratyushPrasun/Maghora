import mongoose, {
  Schema,
  type Document,
  type Types,
} from "mongoose";

export interface IProductImage {
  publicId: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface IProductVariant {
  _id?: Types.ObjectId;
  sku: string;
  weightGrams: number;
  pricePaise: number;
  mrpPaise: number;
  stockOnHand: number;
  reservedStock: number;
  isActive: boolean;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: Types.ObjectId;
  images: IProductImage[];
  variants: IProductVariant[];
  isActive: boolean;
  isFeatured: boolean;
  isDeleted: boolean;
  seo: {
    title: string;
    description: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const imageSchema = new Schema<IProductImage>(
  {
    publicId: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    alt: {
      type: String,
      default: "",
      maxlength: 150,
    },

    isPrimary: {
      type: Boolean,
      default: false,
    },

    sortOrder: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const variantSchema = new Schema<IProductVariant>(
  {
    sku: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    weightGrams: {
      type: Number,
      required: true,
      min: 1,
    },

    pricePaise: {
      type: Number,
      required: true,
      min: 1,
    },

    mrpPaise: {
      type: Number,
      required: true,
      min: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    
    stockOnHand: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    reservedStock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: false,
  }
);

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
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
      required: true,
      trim: true,
      maxlength: 5000,
    },

    shortDescription: {
      type: String,
      trim: true,
      maxlength: 250,
      default: "",
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    images: {
      type: [imageSchema],
      default: [],
    },

    variants: {
      type: [variantSchema],
      required: true,
      validate: {
        validator: (variants: IProductVariant[]) => {
          if (!variants.length) return false;

          const skus = variants.map((variant) =>
            variant.sku.toUpperCase()
          );

          return new Set(skus).size === skus.length;
        },
        message: "Product variant SKUs must be unique",
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    seo: {
      title: {
        type: String,
        trim: true,
        maxlength: 70,
        default: "",
      },

      description: {
        type: String,
        trim: true,
        maxlength: 170,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Product URL must be unique.
productSchema.index(
  { slug: 1 },
  { unique: true }
);

// SKU must be unique across products.
productSchema.index(
  { "variants.sku": 1 },
  { unique: true }
);

// Useful for catalogue filtering.
productSchema.index({
  category: 1,
  isActive: 1,
  isDeleted: 1,
  createdAt: -1,
});

const Product = mongoose.model<IProduct>(
  "Product",
  productSchema
);

export default Product;