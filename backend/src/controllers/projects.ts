import { Request, Response } from "express";
import { createProject, getAllProjects } from "../services/projects";

// register a project endpoint
export default async function registerProject(req: Request, res: Response) {
    try {
        if(!(req as any).user?.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

         const project = await createProject({
            ...req.body,
            homeownerId: (req as any).user.id,
        });

        return res.status(201).json(project);
    } catch (err: any) {
        console.error("Error creating project:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function getEstimateController(req: Request, res: Response) {}


// browsing all projects 
export async function browseProjects(req: any, res: any) {
  try {
    const projects = await getAllProjects();

    return res.json(projects);
  } catch (err: any) {
    console.error("Error browsing projects:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

