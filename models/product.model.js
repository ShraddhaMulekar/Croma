import mongoose from "mongoose"

const ProductSchema = new mongoose.Schema({
    img : {type : String, required:true},
    title : {type : String, required:true},
    description : {type : String, required:true},
    category : {type : String, required:true},
    subCategory : {type : String, required:true},
    price : {type : Number, required:true}
},{
    versionKey : false
})

const ProductModel = mongoose.model("product", ProductSchema)

export default ProductModel