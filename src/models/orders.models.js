import mongoose, { Schema } from 'mongoose';

const orderedItemsSchema = [
  {
    name: {
      type: String,
      required: true,
    },
    qty: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    }
  },
];

const orderSchema = new Schema(
  {
    orderedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required:true,
        index: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
        index: true
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
        enum: ["Pending", "Cancelled", "Returned", "Delivered"],
        default : "Pending",
    },
    images: {
        type: String,
        required: true
    },
    grandTotal : {
        type: Number,
        required: false,
    }
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);