import { asynchandler } from "../utils/asynchandler.js"
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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


export {registerUser}