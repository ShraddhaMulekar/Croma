import express from "express";
import ProductModel from "../models/product.model.js";
import CartModel from "../models/cart.model.js";
import auth from "../middlewares/auth.middleware.js"

const cartRouter = express.Router();

cartRouter.post("/addToCart",auth, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id

  console.log(("userId", userId))
  try {
    if (!userId) {
      return res.status(401).json({ msg: "User ID not found! Please log in again." });
    }
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.json({ msg: "Product not found!.." });
    }

    let cart = await CartModel.findOne({userId});
    if (!cart) {
      cart = new CartModel({ userId, items: [{ productId, quantity }] });
    } else {
      let existingProduct = cart.items.find(
        (item) => item.productId.toString() === productId
      );
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    res.json({ msg: "Product added successful!..", cart });

  } catch (error) {
    res.json({
      msg: "error in post method of add to cart functionality!..",
      error,
    });
  }
});

cartRouter.get("/", auth, async(req, res) => {
    // const {userId} = req.body
    try {
      if (!req.user.id) {
        return res.status(401).json({ msg: "User not authenticated!" });
      }
        const cart = await CartModel.findOne({userId:req.user.id}).populate("items.productId")
        
        if(!cart){
           return res.json({msg:"cart not found!.."})
        }

        res.json({msg:"cart found successfully!..", cart})

    } catch (error) {        
        res.json({ msg: "error in cart get route..", error });
    }
});

// remove from cart
cartRouter.delete("/deletecart", auth, async (req, res) => {
  const { productId } = req.body;
  const userId = req.userId;

  try {
    const cart = await CartModel.findOne({ userId });
    if (!cart) {
      return res.json({ msg: "cart not found!" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId.toString()
    );

    await cart.save();
    return res.json({ msg: "product remove from cart!..", cart });

  } catch (error) {
    console.log("error in delete route of cart!", error);
    return res.json({ msg: "error in delete route of cart!", error });
  }
});

export default cartRouter;
