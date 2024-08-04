import mongoose,{Schema} from "mongoose";


const orderSchema = new Schema({
    owner : {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    orderStatus: {
        type: String,
        required: true,
    },
},{timestamps: true})