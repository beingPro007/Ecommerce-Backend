import mongoose, {model, Schema} from "mongoose";

const productSchema = new Schema(
  {
    prodName: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    prodImages: [{ type: String, required: true }],
  },
  { timestamps: true }
);

export const Product = model("Product", productSchema);