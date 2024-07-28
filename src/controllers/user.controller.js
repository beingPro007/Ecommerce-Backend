import { asynchandler } from "../utils/asynchandler.js"
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { access } from "fs";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      error.message
    );
  }
};

const registerUser = asynchandler(async(req, res, next, err) => {

    //Getting values from body...
    const {fullName, email, password, username, phoneNumber} = req.body;

    //checking for empty case...
    if (
      [fullName, email, password, username, phoneNumber].some(
        (field) => field?.trim === ''
      )
    ) {
      console.log('Every Fields in this are compulsory!');
    }

    //user with user exits or not
    const existedUser = await User.findOne({
      $or: [{ username }, { email }, {phoneNumber}],
    });
    
    if(existedUser){
        throw new ApiError(
            404,
            "User with username or email adress already exits!"
        )
    }


    //user creation
    const user = await User.create({
        fullName,
        password,
        phoneNumber,
        email,
        username,
    })


    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if(!createdUser){
        throw new ApiError(
            500,
            "User can't be created!"
        )
    }

    return res.status(200).
    json(new ApiResponse(200, createdUser, "User created successfully !"))

})

const loginUser = asynchandler(async(req, res) => {
  const { username, phoneNumber, email, password } = req.body;

  if(!username && !email && !phoneNumber){
    console.log("You must need to enter one of them!");
  }

  const user = await User.findOne({
    $or: [{username}, {email}, {phoneNumber}]
  })

  if(!user){
    throw new ApiError(404, "User is not in our System so kindly Register first !");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if(!isPasswordValid) throw new ApiError(404, "Enter the correct Password !");

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  const options = {
    httpOnly: true,
    secure: true
  }

  return res.status(200).
  cookie("accessToken", accessToken, options).
  cookie("refreshToken", refreshToken, options).
  json(new ApiResponse(200, "User Logged in Succesfully", loggedInUser));

})
export {registerUser, loginUser};