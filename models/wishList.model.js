import mongoose from "mongoose";

const WishListSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
        date: { type: Date, default: Date.now() },
      },
    ],
  },
  {
    versionKey: false,
  }
);

const WishListModel = mongoose.model("wishList", WishListSchema);

export default WishListModel;
