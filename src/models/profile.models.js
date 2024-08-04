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
      default: ""
    },
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export const Profile = mongoose.model('Profile', profileSchema);