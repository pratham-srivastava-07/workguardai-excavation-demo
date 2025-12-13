import { Request, Response } from "express";
import { getUserProjectsAndOffers } from "../services/projects-offers";

export async function getUserProjectsAndOffersController(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    console.log("USER", user);
    
    if (!user || !user.id || !user.role) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.log("REACHED HERE");
    

    const result = await getUserProjectsAndOffers(user.id, user.role);

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    return res.json(result.data);
  } catch (error: any) {
    console.error("Error in getUserProjectsAndOffersController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

