import { prismaClient } from "../db";
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

  return newUser;
}