import mongoose,{Schema} from "mongoose";

const categorySchema = new Schema({
    categoryName: {
        type: String,
        unique: true
    },
    description: {
        type: String,
        required : false
    }
},{timestamps: true})