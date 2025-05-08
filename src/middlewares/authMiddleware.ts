import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  console.log("Auth middleware triggered for:", req.method, req.originalUrl);
  if (!req.session?.jwt) {
    throw new Error("Not authorized");
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_SECRET!
    ) as UserPayload;
    req.currentUser = payload;
    console.log(payload);
    next();
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      return res
        .status(400)
        .json({ message: "Invalid token, please log in again! " });
    }
    if (error.name === "TokenExpiredError") {
      return res
        .status(400)
        .json({ message: "Your token has expired login again " });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const generateToken = (
  id: string,
  email: string,
  role: string
): string => {
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });
};

export const requireRole = (...roles: string[]): any => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.currentUser;

      if (!user) {
        return res.status(401).json({ message: "Not Authorized" });
      }

      if (!roles.includes(user.role)) {
        res.status(403).send(`Requires ${roles.join(" or ")} role. You have ${
          user.role
        } 
        role.`);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
