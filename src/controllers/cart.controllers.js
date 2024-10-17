import { Cart } from '../models/cart.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asynchandler } from '../utils/asynchandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Product } from '../models/product.models.js';
import { User } from '../models/user.models.js';
import mongoose from 'mongoose';


const addToCart = asynchandler(async (req, res) => {
  const prodId = req.params.prodId;
  const userId = req.user?.id;
  
  if(!userId){
    throw new ApiError(400, "User not found!!!")
  }

  if (!prodId) {
    throw new ApiError(
      400,
      'Product ID is not entered or product is not available!!!'
    );
  }

  const product = await Product.findById(prodId);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  const price = product.price;
  const quantity = Number(req.body.quantity);

  if (!quantity || isNaN(quantity) || !prodId) {
    throw new ApiError(
      400,
      'Quantity must be a valid number, and all fields are mandatory!'
    );
  }

  if (quantity <= 0 || quantity > 100) {
    throw new ApiError(400, 'Quantity must be between 1 and 100');
  }

  // Use findOne to find the specific item in the cart
  let inCart = await Cart.findOne({ prodId: `${prodId}` });

  if (!inCart) {
    // If product is not in the cart, create a new entry
    const newCartItem = await Cart.create({
      prodId,
      quantity,
      price,
      addedBy: userId
    });

    return res
      .status(200)
      .json(new ApiResponse(200, 'Added to Cart Successfully!!!', newCartItem));
  } else {
    // If product is already in the cart, update the quantity
    inCart.quantity += quantity;
    await inCart.save();

    return res
      .status(200)
      .json(new ApiResponse(200, 'Quantity Updated Successfully!!!', inCart));
  }
});

const getCartItems = asynchandler(async (req, res) => {
  const page = Number(req.params.pageNo) || 1;
  const pageSize = 2; // Set page size
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(400, 'User not found!!!');
  }

  const items = await Cart.aggregate([
    {
      $match: {
        addedBy: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $project: {
        quantity: 1,
        prodId: 1,
        price: 1,
        createdAt: 1, 
      },
    },
    {
      $sort: {
        createdAt: -1, 
      },
    },
    {
      $skip: pageSize * (page - 1), 
    },
    {
      $limit: pageSize,
    },
  ]);

  if (items.length === 0) {
    throw new ApiError(400, 'Bag is empty!!!');
  }

  res
    .status(200)
    .json(new ApiResponse(200, 'Cart Fetched Successfully!!!', items));
});


export { addToCart, getCartItems };
