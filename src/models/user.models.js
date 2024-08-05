import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const shippingAddressSchema = new Schema({
    street:{
        type:String,
        required: true,
        trim: true,
    },
    landMark: {
        type: String,
        required: false,
        trim: true
    },
    city:{
        type: String,
        required: true,
        trim: true,
    },
    postalCode:{
        type: String,
        required: true,
        trim: true,
    },
    state:{
        type: String,
        required: true,
        trim: true,
    },
    country: {
        type: String,
        required:true,
        trim: true,
    }
},{timestamps: false})

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      lowerCase: true,
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      match: [/.+@.+\..+/, 'Please fill a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
    },
    role: {
      type: String,
      default: 'customer',
      required: false,
      enum: ["customer", "admin"]
    },
    phoneNumber: {
      type: String,
      required: true,
      match: [/^[0-9]+$/, 'Please fill with numbers only'],
    },
    refreshToken: {
      type: String,
    },
    avatar: {
      type: String,
      default : ""
    },
    shippingAddress: shippingAddressSchema,
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function(){
  return jwt.sign(
    {
      email: this.email,
      _id: this._id,
      password: this.password,
      phoneNumber: this.phoneNumber,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: process.env.ACCESS_TOKEN_SECRET_KEY_EXPIRY
    }
  );
}

userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
    {
      _id: this.id,
    },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    {
      expiresIn: process.env.REFRESH_TOKEN_SECRET_KEY_EXPIRY
    }
  );
}

export const User = mongoose.model("User", userSchema)