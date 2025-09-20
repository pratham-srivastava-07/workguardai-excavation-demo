import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants";

export function generateTokens(payload: { id: string; email: string }) {
  const accessToken = jwt.sign(payload, JWT_SECRET as string, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, JWT_SECRET as string, { expiresIn: "7d" });
  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, JWT_SECRET as string);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, JWT_SECRET as string);
}