import express from "express";
import auth from "../middlewares/auth.middleware.js";
import WishListModel from "../models/wishList.model.js";
import ProductModel from "../models/product.model.js";

const wishListRouter = express.Router();

//added in wish list
wishListRouter.post("/addWishList", auth, async (req, res) => {
  const { productId } = req.body;
  const userId = req.userId;

  try {
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.json({ msg: "product not available!" });
    }

    let wishList = await WishListModel.findOne({ userId });
    if (!wishList) {
      wishList = new WishListModel({ userId, items: [{ productId }] });
    } else {
      let existingwishList = wishList.items.find(
        (item) => item.productId.toString() === productId.toString()
      );
      if (existingwishList) {
        return res.json({ msg: "already product in wish list" });
      }
      wishList.items.push({ productId });
    }

    await wishList.save();
    return res.json({ msg: "product added in wish list!..", wishList });
  } catch (error) {
    res.json({ msg: "error in post route of wish list" });
  }
});

// display wish list
wishListRouter.get("/displayWishList", auth, async (req, res) => {
  const { userId } = req.body;

  try {
    const wishList = await WishListModel.findOne({ userId }).populate(
      "items.productId"
    );
    if (!wishList) {
      return res.json({ msg: "your wish list empty!" });
    }
    return res.json({ msg: "your product added to wish list!..", wishList });
  } catch (error) {
    return res.json({ msg: "error in get method of wish list!..", error });
    console.log("error in get method of wish list!..", error);
  }
});

// remove from wish list
wishListRouter.delete("/deleteWishList", auth, async (req, res) => {
  const { productId } = req.body;
  const userId = req.userId;

  try {
    const wishList = await WishListModel.findOne({ userId });
    if (!wishList) {
      return res.json({ msg: "wish list not found!" });
    }

    wishList.items = wishList.items.filter(
      (item) => item.productId.toString() !== productId.toString()
    );
    await wishList.save();
    return res.json({ msg: "product remove from wish list!..", wishList });
  } catch (error) {
    console.log("error in delete route of wish list!", error);
    return res.json({ msg: "error in delete route of wish list!", error });
  }
});

export default wishListRouter;
