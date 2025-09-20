import { Request, Response } from "express";
import { verifyRefreshToken } from "../utils/authUtils";
import { prismaClient } from "../db";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../constants";

export async function refreshController(req: Request, res: Response) {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: "No refresh token provided" });

  try {
    const decoded = verifyRefreshToken(refreshToken) as { id: string; email: string };

    // 🔹 optional: check if refresh token exists in DB
    const stored = await prismaClient.refreshToken.findFirst({
      where: { token: refreshToken, userId: decoded.id },
    });
    if (!stored) return res.status(403).json({ message: "Invalid refresh token" });

    const accessToken = jwt.sign({ id: decoded.id, email: decoded.email }, JWT_SECRET as string, { expiresIn: "15m" });

    return res.json({ accessToken });
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
}
