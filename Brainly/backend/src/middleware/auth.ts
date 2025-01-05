import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

function auth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers["authorization"];
  const decode = jwt.verify(header as string, process.env.JWT_SECRET);
  if (decode) {
    if (typeof decode === "string") {
      res.status(403).json({
        Message: "You are not loged In",
      });
      return;
    }
    // @ts-ignore
    req.userId = decode.id;
    next();
  } else {
    res.status(403).json({
      message: "You are not logged in",
    });
  }
}

export default auth;
