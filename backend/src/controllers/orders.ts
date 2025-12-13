import { Request, Response } from "express";
import { getOrders } from "../services/orders";

export async function getOrdersController(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    if (!user || !user.id || !user.role) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await getOrders(user.id, user.role);

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    return res.json(result.data);
  } catch (error: any) {
    console.error("Error in getOrdersController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

