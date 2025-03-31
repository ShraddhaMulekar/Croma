import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        email : {type : String, required : true, unique : true},
        password : {type : String, required : true},
        name : {type : String, required : true},
        time: {type: Date, default:Date.now()},
        role: {type: String, enum:["admin", "user"], default:"user"}
    }, {
        versionKey : false
    }
)

const UserModel = mongoose.model("user", UserSchema)

export default UserModel