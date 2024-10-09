import mongoose, { model, Schema } from 'mongoose';

const productSchema = new Schema(
  {
    prodName: {
      type: String,
      required: false,
      index: true,
      unique: true, // Ensures product names are unique
    },
    description: {
      type: String,
      required: true, // Ensures every product has a description
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price must be greater than 0'], // Ensures the price is not negative
    },
    category: {
      type: String,
      required: true, // Ensures every product is associated with a category
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock must be greater than 0'], // Ensures the stock is not negative
    },
    prodImages: [{ type: String, required: true }], // Ensures at least one product image is provided
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

export const Product = model('Product', productSchema);