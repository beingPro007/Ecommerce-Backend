import { asynchandler } from '../utils/asynchandler.js';
import { ApiError } from '../utils/ApiError.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.models.js';
import bcrypt from "bcrypt"

const addProfilePicture = asynchandler(async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(
      400,
      'Unauthorized Access ! You must sign in to do this !'
    );
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(
      400,
      "Avatar local path don't exists or haven't passed!"
    );
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(400, 'Avatar is required');
  }

  const profilePic = {};

  if (avatar) profilePic.avatar = avatar?.url;

  const addedProfilePic = await User.findByIdAndUpdate(
    { _id: userId },
    { $set: profilePic },
    { new: true, runValidators: true }
  );

  if (!addedProfilePic) {
    throw new ApiError(400, "Couldn't update profile picture");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        'Profile Pic added to user Successfully ! ',
        addedProfilePic
      )
    );
});

const updateProfile = asynchandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(
      400,
      'Unauthorized Access ! You must login before doing anything !'
    );
  }

  const { phoneNumber, email, fullName, password, username } = req.body;

  if (!phoneNumber && !email && !fullName && !password && !username) {
    throw new ApiError(400, 'At least one field must be provided to update!');
  }

  const existedEntries = await User.findOne({
    $or: [{ phoneNumber }, { email }, { username }],
  });

  if (existedEntries) {
    throw new ApiError(
      400,
      'User with phoneNumber, email or username may exists you need to enter unique values for them!'
    );
  }

  const updatedEntries = {};

  if (phoneNumber) updatedEntries.phoneNumber = phoneNumber;
  if (email) updatedEntries.email = email;
  if (username) updatedEntries.username = username;
  if (fullName) updatedEntries.fullName = fullName;
  if (password) updatedEntries.password = await bcrypt.hash(password, 10);

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updatedEntries },
    { new: true, runValidators: true }
  );

  await updatedUser.save();

  if(!updatedUser){
    throw new ApiError(500, "User cannot able to be updated")
  }

  const updatedUserAfterFilteration = await User.findById(updatedUser._id).select(
    '-password -refreshToken'
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        `User Updated Succesfully and You updated the following things ${Object.keys(updatedEntries).join(', ')}`,
        updatedUserAfterFilteration
      )
    );
});

export { addProfilePicture, updateProfile };