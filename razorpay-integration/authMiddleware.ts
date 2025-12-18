import type { Request, Response, NextFunction } from "express";
import { prisma } from "./db";

export interface AuthRequest extends Request {
  userId?: string;
}

export async function auth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.headers["x-user-id"] as string;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized - User ID required" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(401).json({ error: "Unauthorized - Invalid user" });
      return;
    }

    req.userId = userId;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
