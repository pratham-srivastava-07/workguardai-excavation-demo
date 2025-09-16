import { prismaClient } from "../db";


export async function getUserRole(userId: string): Promise<string | null> {
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  return user?.role ?? null;
}