import express from "express";
import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import LogOutModel from "../models/user.logOut.model.js";

const userRouter = express.Router();
let regexPass = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;"'<>,.?/\\|]).{8,}$/;

// user registration
userRouter.post("/register", async (req, res) => {
  const { email, password, name } = req.body;
  if (!regexPass.test(password)) {
    res.json({
      msg: "Password must contain at least one letter, one number, one special character, and be at most 8 characters long.",
    });
  }
  try {
    const matchEmail = await UserModel.findOne({ email });
    if (matchEmail) {
      res.json({
        msg: "You are already register with same email Id. please Log in now!",
        matchEmail,
      });
    }

    bcrypt.hash(password, Number(process.env.SALT_ROUND), async (err, hash) => {
      if (err) {
        res.json({ msg: "password invalid!" });
      } else {
        let newUser = new UserModel({ email, name, password: hash });
        await newUser.save();
        res.json({ msg: "register successful!", newUser });
        console.log("register successful matchEmail:", matchEmail, "newUser:", newUser);
      }
    });
  } catch (error) {
    console.log("Error in backend user register post router", error);
    res.json({ msg: "Error in backend user register post router", error });
  }
});

//user log in
userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const matchEmail = await UserModel.findOne({ email });

    if (!matchEmail) {
      res.json({ msg: "you are not register. please register!" });
    } else {
      bcrypt.compare(password, matchEmail.password, async (err, result) => {
        if (result) {
          let payload = {
            userId: matchEmail._id,
            userName: matchEmail.name,
          };
          const token = jwt.sign(payload, process.env.JWT_SECRETE_KEY, {expiresIn: "48h"});
          res.json({ msg: "log in successful!", token });
          console.log("log in successful!", token);
        } else {
          res.json({ msg: "password invalid!", err });
        }
      });
    }
  } catch (error) {
    console.log("Error in backend user log in post router", error);
    res.json({ msg: "Error in backend user log in post router", error });
  }
});

// user log out
userRouter.post("/logout", async (req, res) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.json({ msg: "token invalid!" });
    }
    const logOut = await LogOutModel.create({ token });
    res.json({ msg: "log out successful!", logOut });
    console.log("log out successful!", logOut)
  } catch (error) {
    console.log("error in log out backend route", error);
    res.json({ msg: "error in log out backend route", error });
  }
});

// check all users
userRouter.get("/check", async (req, res) => {
  try {
    const user = await UserModel.find();
    res.json({ msg: "All users!..", user });
  } catch (error) {
    console.log("error in get user router", error);
    res.json({ msg: "error in get user router", error });
  }
});

export default userRouter;
