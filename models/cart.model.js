import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
    userId : {type:mongoose.Schema.Types.ObjectId, ref:"user"},
    items : [
        {
            productId : {type:mongoose.Schema.Types.ObjectId, ref:"product"},
            quantity : {type:Number, default:1}
        }
    ]
}, {
    versionKey : false
})

const CartModel = mongoose.model("cart", CartSchema)

export default CartModel;