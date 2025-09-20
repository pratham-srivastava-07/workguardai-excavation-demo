
import { Request, Response } from "express";
import { submitQuote, getProjectQuotes, updateQuoteStatus } from "../services/quotes";
import { getUniqueContractorProfileById } from "../services/contractor";
import { getHomeOwnerProjectById } from "../services/projects";

export async function submitQuoteController(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    if (!user || user.role !== 'CONTRACTOR') {
      return res.status(403).json({ error: "Only contractors can submit quotes" });
    }

    const contractorProfile = await getUniqueContractorProfileById(user.id);
    if (!contractorProfile) {
      return res.status(403).json({ error: "Complete contractor profile first" });
    }

    const result = await submitQuote({
      ...req.body,
      contractorId: contractorProfile.id
    });

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(201).json(result.data);
  } catch (err: any) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getQuotesController(req: Request, res: Response) {
  try {
    const { projectId } = req.params;
    const user = (req as any).user;

    // Verify project ownership for homeowners
    if (user?.role === 'HOMEOWNER') {
      const project = await getHomeOwnerProjectById(projectId);

      if (!project || project.homeownerId !== user.id) {
        return res.status(403).json({ error: "Access denied" });
      }
    }

    const result = await getProjectQuotes(projectId);
    if (result.error) {
      return res.status(500).json({ error: result.error });
    }

    return res.json(result.data);
  } catch (err: any) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateQuoteController(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = (req as any).user;

    if (!user || user.role !== 'HOMEOWNER') {
      return res.status(403).json({ error: "Only homeowners can update quotes" });
    }

    const result = await updateQuoteStatus(id, status, user.id);
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    return res.json(result.data);
  } catch (err: any) {
    return res.status(500).json({ error: "Internal server error" });
  }
}