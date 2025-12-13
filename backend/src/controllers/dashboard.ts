import { Request, Response } from "express";
import {
  getHomeownerDashboardStats,
  getCompanyDashboardStats,
  getCityDashboardStats,
} from "../services/dashboard";

export async function getDashboardStatsController(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const role = user.role;

    let result;
    if (role === "HOMEOWNER") {
      result = await getHomeownerDashboardStats(user.id);
    } else if (role === "COMPANY") {
      result = await getCompanyDashboardStats(user.id);
    } else if (role === "CITY") {
      result = await getCityDashboardStats(user.id);
    } else {
      return res.status(403).json({ error: "Invalid user role" });
    }

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    return res.json(result.data);
  } catch (error: any) {
    console.error("Error in getDashboardStatsController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

