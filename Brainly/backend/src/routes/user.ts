import { Router } from "express";
import z from "zod";
import bcrypt from "bcrypt";
import User from "../Models/usermodel";
import jwt from "jsonwebtoken";
export const userRouter = Router();

const userSchema = z.object({
  username: z.string().min(3).max(10),
  password: z.string().min(6).max(50),
});

userRouter.post("/signup", async (req, res) => {
  try {
    const { username, password } = userSchema.parse(req.body);

    const userExist = await User.findOne({ username });
    if (userExist) {
      res.status(403).json({
        Message: "User Already Exist",
      });
    }
    const hashedpassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedpassword,
    });

    res.status(200).json({
      Message: "User Created",
    });
  } catch (error: any) {
    res.status(500).json({
      Message: "Internal Server Error",
      error: error.message,
    });
  }
});

userRouter.post("/signin", async (req, res) => {
  try {
    const { username, password } = userSchema.parse(req.body);

    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({
        Message: "User Not Found",
      });
      return;
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      res.status(400).json({
        Message: "Password Wrong ",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.status(200).json({
      Message: "User Logged In",
      token: token,
    });
  } catch (error: any) {
    res.status(500).json({
      Message: "Internal Server Error",
      error: error.message,
    });
  }
});
