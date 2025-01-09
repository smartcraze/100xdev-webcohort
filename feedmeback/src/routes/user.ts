import { Router } from "express";
import { Login, Register, UserDetails } from "../controller/user";
import auth from "../middleware/Authenticated";

export const userRouter = Router();

userRouter.post("/singup", Register);
userRouter.post("/singin", Login);
userRouter.get("/me", auth, UserDetails);
