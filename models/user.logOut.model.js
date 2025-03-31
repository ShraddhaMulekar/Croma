import mongoose from "mongoose";

const logOutSchema = new mongoose.Schema(
    {
        token : {type:String, required:true},
        time: {type:Date, default:Date.now}
    }, {
        versionKey : false
    }
)

const LogOutModel = mongoose.model("logOut", logOutSchema)

export default LogOutModel