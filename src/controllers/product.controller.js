import { Product } from '../models/product.models.js';
import { ApiError } from '../utils/ApiError.js';
import { asynchandler } from '../utils/asynchandler.js';
import fs from 'fs';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const addProduct = asynchandler(async (req, res) => {
  const user = req.user;
  const { prodName, description, price, stock, category } = req.body;

  if (
    [prodName, description, price, stock, category].some((fields) => {
      fields?.trim === '';
    })
  ) {
    console.log('All fields are important !');
  }

  const findProd = await Product.findOne({prodName});

  if(findProd){
    throw new ApiError(400, "Product Already Exists! Add New Product")
  }

  const prodImageLocalPath = req.files?.prodImages?.map((file) => file.path);

  if (!prodImageLocalPath) {
    throw new ApiError(400, 'prodImage is required');
  }

  const uploadedProdImage = [];
  for(const path of prodImageLocalPath){
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
    .json(new ApiResponse(200, 'Product added SuccesFully to our database', product));
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




export {addProduct, getCategoryProducts}