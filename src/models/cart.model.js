import mongoose, {Schema} from "mongoose"

const cartSchema = new Schema({
    
}, {timestamps: true});

const Cart = mongoose.model("Cart", cartSchema);