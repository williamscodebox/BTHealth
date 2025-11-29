import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "jsonwebtoken";
import User from "../models/User";
import dotenv from "dotenv";

dotenv.config();

// Extend Express Request to include `user`
interface AuthRequest extends Request {
  user?: typeof User.prototype;
}

// const response = await fetch(`http://localhost:3000/api/books`, {
//   method: "POST",
//   body: JSON.stringify({
//     title,
//     caption
//   }),
//   headers: { Authorization: `Bearer ${token}` },
// });

const protectRoute = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "No authentication token, access denied" });
    }
    // get token
    const token = authHeader.replace("Bearer ", "");
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined in environment");
    }

    // verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as jwt.Secret
    ) as JwtPayload & {
      userId: string;
    };

    // find user
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ message: "Token is not valid" });

    req.user = user;
    next();
  } catch (error: any) {
    console.error("Authentication error:", error.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default protectRoute;
