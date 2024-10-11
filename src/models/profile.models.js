import mongoose, { Schema } from 'mongoose';

const profileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    profilePicture: {
      type: String,
      required: false,
      default: '',
    },
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: [
        {
          landmark: { type: String, required: true },
          city: { type: String, required: true },
          state: { type: String, required: true },
          country: { type: String, required: true },
          zipcode: { type: String, required: true },
        },
      ],
      required: false,
      default: [],
    },
  },
  { timestamps: true }
);

export const Profile = mongoose.model('Profile', profileSchema);