import { prismaClient } from "../db";
import { generateTokens } from "../utils/authUtils";
import { hashPassword } from "../validators";

export async function signupService(name: string, email: string, password: string) {
  const existingUser = await prismaClient.user.findFirst({ where: { email } });

  if (existingUser) {
    throw new Error(`User with email ${email} already exists, please login!`);
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await prismaClient.user.create({
    data: { name, email, password: hashedPassword },
  });

  const tokens = generateTokens({ id: newUser.id, email: newUser.email });

  return { newUser, ...tokens };
}