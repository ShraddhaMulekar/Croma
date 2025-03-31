import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectToDB from "./config.db/db.js"
import userRouter from "./routes/user.route.js"
import productRouter from "./routes/product.route.js"
import cartRouter from "./routes/Cart.route.js"
import wishListRouter from "./routes/wishList.route.js"
import orderRouter from "./routes/order.route.js"
dotenv.config()

const app = express()
const port = process.env.PORT || 5000
app.use(express.json())
app.use(cors())

app.use("/user", userRouter)
app.use("/product", productRouter)
app.use("/cart", cartRouter)
app.use("/wishList", wishListRouter)
app.use("/order", orderRouter)

app.listen(port, async()=>{
    await connectToDB()
    console.log(`server running on http://localhost:${port}`)
})