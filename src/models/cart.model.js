import mongoose, {Schema} from "mongoose"

const cartSchema = new Schema({
    addedBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        max: 100,
    },
    prodId: {
        type: mongoose.Types.ObjectId,
        ref: "Product"
    },
    price: {
        type: Number,
        required: true,
    },
}, {timestamps: true});

cartSchema.pre('save', function(next){
    this.total = this.price * this.quantity;
    next();
})

export const Cart = mongoose.model("Cart", cartSchema);