import { Router } from "express";
import z from "zod";
import User from "../Models/usermodel";
export const userRouter = Router();

const userSchema = z.object({
  username: z.string().min(3).max(10),
  password: z.string().min(6).max(50),
});

userRouter.post("/singup", async (req, res) => {
  try {
    const { username, password } = userSchema.parse(req.body);
    if (!username || !password) {
      res.status(411).json({
        Message: "Please Provide Username and Password",
      });
    }
    const userExist = await User.findOne({ username });
    if (userExist) {
      res.status(403).json({
        Message: "User Already Exist",
      });
    }
    const user = await User.create({
      username,
      password,
    });
    res.status(200).json({
      Message: "User Created",
      user: user,
    });
  } catch (error: any) {
    res.status(500).json({
      Message: "Internal Server Error",
      error: error.message,
    });
  }
});

userRouter.get("/singup", (req, res) => {
  res.status(200).json({
    Message: "User Get",
  });
});
