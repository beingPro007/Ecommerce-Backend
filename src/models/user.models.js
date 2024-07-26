import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"

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
      required: false
    },
    phoneNumber: {
      type: String,
      required: true,
      match: [/^[0-9]+$/, 'Please fill with numbers only'],
    },
    refreshToken: {
      type: String,
    },
    shippingAddress: shippingAddressSchema,
  },
  { timestamps: true }
);

userSchema.pre("save", async function(next){
    if(!this.isModified) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next();
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

export const User = mongoose.model("User", userSchema)