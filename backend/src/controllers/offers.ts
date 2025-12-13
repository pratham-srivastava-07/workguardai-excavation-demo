import { Request, Response } from "express";
import { createOffer, getPostOffers, updateOfferStatus, updateOffer } from "../services/offers";
import { offerCreateSchema } from "../utils/zod";
import { OfferStatus } from "@prisma/client";
import { prismaClient } from "../db";

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
    // Get companyId if user is a company
    let companyId: string | undefined;
    const userRole = (req as any).user?.role;
    if (userRole === 'COMPANY') {
      const companyProfile = await prismaClient.companyProfile.findUnique({
        where: { userId },
        select: { id: true },
      });
      if (companyProfile) {
        companyId = companyProfile.id;
      }
    }

    const result = await createOffer({
      ...parsedBody.data,
      userId,
      companyId,
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
    return res.status(400).json({ message: "Invalid offer status" });
  }

  try {
    const result = await updateOfferStatus(id, userId, status as OfferStatus);

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

export async function updateOfferController(req: Request, res: Response) {
  const { id } = req.params;
  const { amount, message } = req.body;
  const userId = (req as any).user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const result = await updateOffer(id, userId, { amount, message });

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    return res.status(200).json({
      message: "Offer updated successfully",
      data: result.data,
    });
  } catch (error: any) {
    console.error("Error in updateOfferController:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
