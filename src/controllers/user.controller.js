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
    throw new ApiError(500, error.message);
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

const loginUser = asynchandler(async (req, res) => {
  const { username, phoneNumber, email, password } = req.body;

  if (!username && !email && !phoneNumber) {
    throw new ApiError(
      400,
      'You must provide username, email, or phone number!'
    );
  }

  const user = await User.findOne({
    $or: [{ username }, { phoneNumber }],
  });

  if (!user) {
    throw new ApiError(404, 'User not found. Please register first.');
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Incorrect password!');
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        'User logged in Succesfully'
      )
    );
});

const logoutUser = asynchandler(async(req, res) => {

  await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: { refreshToken: undefined },
        },
        {
            new: true,
        },
    );

    const options = {
        httpOnly: true,
        secure: true,
    };
    
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User Logged out"));

})

export {registerUser, loginUser, logoutUser};