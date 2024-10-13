import mongoose, { model, Schema } from 'mongoose';

const reviewSchema = new Schema(
  {
    reviewer: {
      type: String,
      required: true, // Add this to ensure the reviewer is always provided
    },
    prodId: {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
      required: true, // Add this to ensure the product ID is always provided
    },
    noOfStars: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewDescription: {
      type: String,
      required: true,
      default: 'Product is Best',
      minlength: 10, // Optional validation to ensure the review has enough length
      maxlength: 500, // Optional: Limit description length to a reasonable value
    },
  },
  { timestamps: true }
);

export const Review = model('Review', reviewSchema);
