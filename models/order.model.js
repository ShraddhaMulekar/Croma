import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, default: "Shipping" },
  createdAt: { type: Date, default: Date.now },
},{
  versionKey : false
});

const OrderModel = mongoose.model("order", OrderSchema)

export default OrderModel
