import { Request, Response } from "express";
import User from "../model/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { logedinuser, userSchema } from "../schema/userschema";

// signup controller
export async function Register(req: Request, res: Response) {
  try {
    const { name, email, password, username } = userSchema.parse(req.body);

    const userExist = await User.findOne({ username });
    if (userExist) {
      res.status(403).json({
        Message: "User Already Exist",
      });
    }
    const hashedpassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
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
}

// login controller
export async function Login(req: Request, res: Response) {
  try {
    const { username, password } = logedinuser.parse(req.body);

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
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string);

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
}

// getting user details controller

export async function UserDetails(req: Request, res: Response) {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(400).json({
        message: "User ID is missing",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      message: "User details retrieved successfully",
      user: {
        name: user.name,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}
