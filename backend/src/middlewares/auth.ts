import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants";

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  console.log("PROJECT TASK MIDDLEWARE REACHING HERE");
  console.log("AUTH HEADER", authHeader);
  
  
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  console.log("REACHED AFTER HEADER CHK");
  

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Malformed token" });
  }

  console.log("TOKEN MILA", token);
  

  try {
    console.log("Inside try of middleware")
    const decoded = jwt.verify(token, JWT_SECRET as string);
    console.log("DECODED", decoded);
    
    (req as any).user = decoded; // attach payload to req.user
    console.log("REQUEST", req);
    
    next();
  } catch (err: unknown) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
