import { Product } from '../models/product.models.js';
import { Order } from '../models/orders.models.js';
import { ApiError } from '../utils/ApiError.js';
import { asynchandler } from '../utils/asynchandler.js';
import fs from 'fs';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import mongoose from 'mongoose';
import { Review } from '../models/review.models.js';
import {User} from '../models/user.models.js';

const addProduct = asynchandler(async (req, res) => {
  const { prodName, description, price, stock, category } = req.body;

  if (
    [prodName, description, price, stock, category].some((fields) => {
      fields?.trim === '';
    })
  ) {
    console.log('All fields are important !');
  }

  const findProd = await Product.findOne({ prodName });

  if (findProd) {
    throw new ApiError(400, 'Product Already Exists! Add New Product');
  }

  const prodImageLocalPath = req.files?.prodImages?.map((file) => file.path);

  if (!prodImageLocalPath) {
    throw new ApiError(400, 'prodImage is required');
  }

  const uploadedProdImage = [];
  for (const path of prodImageLocalPath) {
    const cloudinaryUpload = await uploadOnCloudinary(path);
    uploadedProdImage.push(cloudinaryUpload?.url);
  }

  const product = await Product.create({
    prodName,
    description,
    price,
    stock,
    category,
    prodImages: uploadedProdImage,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, 'Product added SuccesFully to our database', product)
    );
});

const getCategoryProducts = asynchandler(async (req, res) => {
  const selectedCategory = req.params.category;

  const specificCategory = await Product.aggregate([
    {
      $match: {
        category: selectedCategory,
      },
    },
  ]);

  console.log(selectedCategory);
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        'Category items fetched successfully!',
        specificCategory
      )
    );
});

const getProdById = asynchandler(async (req, res) => {
  const productId = req.params.prodId;

  const product = await Product.findById(productId)

  if (product.length === 0) {
    throw new ApiError(500, 'No Product found for the specified ID');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, 'Product fetched successfully!!!', product));
});

const updateProductDetails = asynchandler(async (req, res) => {
  const product = await Product.aggregate([
    {
      $match: {
        prodName: req.params.prodName,
      },
    },
  ]);

  if (product.length === 0) {
    throw new ApiError(400, 'Product not found');
  }

  const prodId = product[0]._id;

  const { name, description, price, stock, category } = req.body;

  const updatedImagesLocalPath =
    req.files?.prodImages?.map((images) => images.path) || [];

  if (
    !name &&
    !description &&
    !(price > 0) &&
    !(stock > 0) &&
    !category &&
    !updatedImagesLocalPath
  ) {
    throw new ApiError(400, 'At least one field must be provided to update');
  }

  try {
    if (!updatedImagesLocalPath) {
      throw new ApiError(400, "Updated Images can't be fetched");
    }

    const uploadUpdatedImages = [];

    if (req.files && Object.keys(req.files).length !== 0) {
      for (const path of updatedImagesLocalPath) {
        const cloudinaryUpdatedImages = await uploadOnCloudinary(path);
        uploadUpdatedImages.push(cloudinaryUpdatedImages?.url);
      }
    }

    const updatedFields = {};

    if (name) updatedFields.prodName = name;
    if (description) updatedFields.description = description;
    if (price > 0) updatedFields.price = price;
    if (stock > 0) updatedFields.stock = stock;
    if (category) updatedFields.category = category;
    if (uploadUpdatedImages.length !== 0)
      updatedFields.prodImages = uploadUpdatedImages;

    if (Object.keys(updatedFields).length === 0) {
      throw new ApiError(400, 'No field to update');
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: prodId },

      { $set: updatedFields },

      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      throw new ApiError(400, "Can't able to update the given data");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          'Product details updated Succesfully',
          updatedProduct
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const deleteProduct = asynchandler(async (req, res) => {
  const prodToDelete = await Product.aggregate([
    {
      $match: {
        prodName: req.params.prodName,
      },
    },
  ]);

  const prodId = prodToDelete[0]._id;

  const deletedProduct = await Product.findByIdAndDelete(prodId);

  if (!deletedProduct) {
    throw new ApiError(400, 'Entered Product is not found in Our database !');
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, 'Product deleted Successfully !!!', deleteProduct)
    );
});

const addReviews = asynchandler(async (req, res) => {
  const prodId = req.params.prodId;
  const userId = req.user?._id;

  if(!prodId){
    throw new ApiError(400, "Product not found!!")
  }

  if (!userId) {
    throw new ApiError(400, 'You must be logged in to review a product!');
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(400, 'No user found!');
  }

  const reviewer = user.fullName; 
  const { noOfStars, reviewDescription } = req.body;

  if (![reviewer, reviewDescription, noOfStars, prodId].every(Boolean)) {
    throw new ApiError(400, 'All fields are mandatory!');
  }

  if (typeof noOfStars !== 'number' || noOfStars < 0 || noOfStars > 5) {
    throw new ApiError(
      400,
      'Invalid rating. It must be a number between 0 and 5.'
    );
  }

  // Create a new review
  const review = await Review.create({
    reviewer,
    prodId,
    noOfStars,
    reviewDescription: reviewDescription.trim(), 
  });

  // Send the response
  res.status(200).json({
    message: 'Review Created Successfully!',
    review, 
  });
});

const getAllProductReviews = asynchandler(async (req, res) => {
  const prodId = req.params.prodId;

  // Validate the product ID
  if (!mongoose.Types.ObjectId.isValid(prodId)) {
    throw new ApiError(400, 'Invalid product ID!');
  }

  const reviews = await Product.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(prodId),
      },
    },
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'prodId',
        as: 'review',
      },
    },
    {
      $project: {
        _id: 1,
        prodName: 1,
        review: 1
      },
    }
  ]);

  if (!reviews) {
    throw new ApiError(400, 'No reviews found for this product!');
  }

  console.log(reviews);

  return res
    .status(200)
    .json(new ApiResponse(200, 'Reviews fetched successfully!', reviews[0].review));
});

export {
  addProduct,
  getCategoryProducts,
  updateProductDetails,
  deleteProduct,
  getProdById,
  getAllProductReviews,
  addReviews,
};
