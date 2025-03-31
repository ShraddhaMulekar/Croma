import jwt from "jsonwebtoken";
import LogOutModel from "../models/user.logOut.model.js";
import UserModel from "../models/user.model.js";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.json({ msg: "log in first!" });
    }

    const logoutToken = await LogOutModel.findOne({ token });
    if (logoutToken) {
      return res.json({ msg: "user log out! please log in now!.." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRETE_KEY);
    (req.userId = decoded.userId), (req.name = decoded.userName);

    console.log("userauth", req.userId, req.name)
    const user = await UserModel.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    req.user = user; // ✅ Attach user to request
    console.log("Authenticated User:", req.user); // 👈 Debug log
    next();
  } catch (error) {
    res.json({ msg: "error in auth middleware backend", error });
    console.log("error in auth middleware backend", error);
  }
};

export default auth;
