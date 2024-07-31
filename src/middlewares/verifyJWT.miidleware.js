import { User } from '../models/user.models.js';
import { ApiError } from '../utils/ApiError.js';
import { asynchandler } from '../utils/asynchandler.js';
import jwt from 'jsonwebtoken';

export const verifyJwt = asynchandler(async (req, res, next) => {
  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

  if(!token){
    throw new ApiError(404, "Unautorized Access")
  }

  console.log(token);
  console.log(req.cookies)

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
  if(!decodedToken){
    throw new ApiError(400, "The token aauhtentication is not posiible");
  }

  console.log(decodedToken)

  const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

  if(!user){
    throw new ApiError(404,"User not found");
  }

  req.user = user;
  next();

})