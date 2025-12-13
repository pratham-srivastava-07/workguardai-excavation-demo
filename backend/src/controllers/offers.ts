import { Request, Response } from "express";
import { createOffer, getPostOffers, updateOfferStatus } from "../services/offers";
import { offerCreateSchema } from "../utils/zod";
import { OfferStatus } from "@prisma/client";

export async function createOfferController(req: Request, res: Response) {
  const parsedBody = offerCreateSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({
      message: "Invalid request body",
      error: parsedBody.error.flatten(),
    });
  }

  const userId = (req as any).user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const result = await createOffer({
      ...parsedBody.data,
      userId,
      // TODO: Get companyId from user's company profile if user is a company
    });

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    return res.status(201).json({
      message: "Offer created successfully",
      data: result.data,
    });
  } catch (error: any) {
    console.error("Error in createOfferController:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getPostOffersController(req: Request, res: Response) {
  const { postId } = req.params;
  const userId = (req as any).user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const result = await getPostOffers(postId, userId);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    return res.status(200).json({ data: result.data });
  } catch (error: any) {
    console.error("Error in getPostOffersController:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateOfferStatusController(req: Request, res: Response) {
  const { id } = req.params;
  const { status } = req.body;
  const userId = (req as any).user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!Object.values(OfferStatus).includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const result = await updateOfferStatus(id, userId, status);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    return res.status(200).json({
      message: "Offer status updated successfully",
      data: result.data,
    });
  } catch (error: any) {
    console.error("Error in updateOfferStatusController:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

