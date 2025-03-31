import express from "express";
import auth from "../middlewares/auth.middleware.js";
import OrderModel from "../models/order.model.js";
import ProductModel from "../models/product.model.js";

const orderRouter = express.Router();

orderRouter.post("/buy", auth, async (req, res) => {
  try {
    const { quantity, productId, totalPrice } = req.body;
    const userId = req.user.id;
    // Check if product exists
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }
    const newOrder = new OrderModel({
      userId,
      productId,
      quantity,
      totalPrice,
    });
    await newOrder.save();
    res.json({ msg: "Order placed successfully!..", newOrder });
  } catch (error) {
    res.json({ msg: "error in order router in post method", error });
    console.log("error in order router in post method", error);
  }
});

orderRouter.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const order = await OrderModel.find({ userId }).populate({path:"productId"});
    res.json({ msg: "your Order!..", order });

  } catch (error) {
    res.json({ msg: "error in order router in get method", error });
    console.log("error in order router in get method", error);
  }
});

export default orderRouter;
