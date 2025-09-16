import { prismaClient } from "../db";

interface CreateProjectInput {
  title: string;
  description?: string;
  projectType: string;
  budgetMin?: number;
  budgetMax?: number;
  homeownerId: string;
}

export async function createProject(data: CreateProjectInput) {
  return prismaClient.project.create({ data });
}

export async function getAllProjects()  {
    try {
        const allEntities = await prismaClient.project.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })

        return allEntities;
    } catch(er: any)  {
        return {error: `Error occured while fetching projects ${er}`}
    }
}