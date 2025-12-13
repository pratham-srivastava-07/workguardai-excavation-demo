import { prismaClient } from "../db";
import { OfferStatus } from "@prisma/client";

interface CreateOfferInput {
  postId: string;
  userId: string;
  companyId?: string;
  amount?: number;
  message?: string;
}

export async function createOffer(data: CreateOfferInput) {
  try {
    // Verify post exists and is available
    const post = await prismaClient.post.findUnique({
      where: { id: data.postId },
      select: { id: true, status: true, userId: true },
    });

    if (!post) {
      return { error: "Post not found" };
    }

    if (post.status !== "AVAILABLE") {
      return { error: "Post is not available for offers" };
    }

    // Prevent users from making offers on their own posts
    if (post.userId === data.userId) {
      return { error: "You cannot make an offer on your own post" };
    }

    const offer = await prismaClient.offer.create({
      data: {
        ...data,
        status: OfferStatus.PENDING,
      },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        company: {
          select: {
            id: true,
            companyName: true,
            logoUrl: true,
          },
        },
      },
    });

    return { data: offer };
  } catch (error: any) {
    console.error("Error creating offer:", error);
    return { error: `Error creating offer: ${error.message}` };
  }
}

export async function getPostOffers(postId: string, userId: string) {
  try {
    // Verify ownership
    const post = await prismaClient.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    if (!post) {
      return { error: "Post not found" };
    }

    if (post.userId !== userId) {
      return { error: "Unauthorized: You don't own this post" };
    }

    const offers = await prismaClient.offer.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        company: {
          select: {
            id: true,
            companyName: true,
            logoUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { data: offers };
  } catch (error: any) {
    console.error("Error fetching offers:", error);
    return { error: `Error fetching offers: ${error.message}` };
  }
}

export async function updateOfferStatus(
  offerId: string,
  postOwnerId: string,
  status: OfferStatus
) {
  try {
    const offer = await prismaClient.offer.findUnique({
      where: { id: offerId },
      include: {
        post: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!offer) {
      return { error: "Offer not found" };
    }

    // Only post owner can accept/reject offers
    if (offer.post.userId !== postOwnerId) {
      return { error: "Unauthorized: You don't own this post" };
    }

    const updatedOffer = await prismaClient.offer.update({
      where: { id: offerId },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        company: {
          select: {
            id: true,
            companyName: true,
            logoUrl: true,
          },
        },
      },
    });

    // If offer is accepted, mark post as reserved
    if (status === OfferStatus.ACCEPTED) {
      await prismaClient.post.update({
        where: { id: offer.postId },
        data: { status: "RESERVED" },
      });
    }

    return { data: updatedOffer };
  } catch (error: any) {
    console.error("Error updating offer status:", error);
    return { error: `Error updating offer status: ${error.message}` };
  }
}

export async function updateOffer(
  offerId: string,
  userId: string,
  updates: { amount?: number; message?: string }
) {
  try {
    const offer = await prismaClient.offer.findUnique({
      where: { id: offerId },
      select: {
        id: true,
        userId: true,
        companyId: true,
        status: true,
      },
    });

    if (!offer) {
      return { error: "Offer not found" };
    }

    // Only offer creator can modify it
    if (offer.userId !== userId && offer.companyId !== userId) {
      return { error: "Unauthorized: You don't own this offer" };
    }

    // Can only modify pending offers
    if (offer.status !== OfferStatus.PENDING) {
      return { error: "Can only modify pending offers" };
    }

    const updatedOffer = await prismaClient.offer.update({
      where: { id: offerId },
      data: updates,
      include: {
        post: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        company: {
          select: {
            id: true,
            companyName: true,
            logoUrl: true,
          },
        },
      },
    });

    return { data: updatedOffer };
  } catch (error: any) {
    console.error("Error updating offer:", error);
    return { error: `Error updating offer: ${error.message}` };
  }
}

