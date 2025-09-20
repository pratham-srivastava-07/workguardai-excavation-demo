import { prismaClient } from "../db";
import { verifyPassword } from "../validators";
import { generateTokens } from "../utils/authUtils";

export async function signinService(email: string, password: string) {
  const user = await prismaClient.user.findFirst({ where: { email } });
  if (!user) return null;

  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) return null;

  const tokens = generateTokens({ id: user.id, email: user.email });

  return { user, ...tokens };
}