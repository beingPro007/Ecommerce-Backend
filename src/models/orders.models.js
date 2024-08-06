import mongoose, { Schema } from 'mongoose';

const shippingAddressSchema = new Schema(
  {
    street: {
      type: String,
      required: true,
      trim: true,
    },
    landMark: {
      type: String,
      required: false,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    pinCode: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: false }
);

const orderSchema = new Schema(
  {
    orderedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    prodName: {
        type: String,
        required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Cancelled', 'Returned', 'Delivered'],
      default: 'Pending',
    },
    images: {
      type: String,
      required: true,
    },
    grandTotal: {
      type: Number,
      required: false,
    },
    
  },
  { timestamps: true }
);


export const Order = mongoose.model("Order", orderSchema);