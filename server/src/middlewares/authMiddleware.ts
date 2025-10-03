import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    (req as any).userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
