import { prismaClient } from "../db";
import { Role, OfferStatus } from "@prisma/client";

// Get all projects and offers for a user (for Projects/Offers tab)
export async function getUserProjectsAndOffers(userId: string, role: Role) {
  try {
    if (role === "HOMEOWNER") {
      // Get homeowner's projects, posts, and offers they received
      const [projects, myPosts, offersReceived] = await Promise.all([
        prismaClient.project.findMany({
          where: {
            homeownerId: userId,
          },
          include: {
            _count: {
              select: {
                quotes: true,
                milestones: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        }),

        prismaClient.post.findMany({
          where: {
            userId,
            companyId: null, // Just materials
            cityId: null,
            status: { not: "DELETED" }
          },
          orderBy: {
            createdAt: "desc",
          },
        }),

        prismaClient.offer.findMany({
          where: {
            post: {
              userId,
            },
          },
          include: {
            post: {
              select: {
                id: true,
                title: true,
                type: true,
                latitude: true,
                longitude: true,
                address: true,
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
          orderBy: {
            createdAt: "desc",
          },
        }),
      ]);

      return {
        data: {
          projects,
          myPosts,
          offersReceived,
          offersMade: [], // Homeowners don't make offers
        },
      };
    } else if (role === "COMPANY") {
      const companyProfile = await prismaClient.companyProfile.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (!companyProfile) {
        return { error: "Company profile not found" };
      }

      // Get offers made by company, offers received on company posts, and available homeowner posts
      const [offersMade, offersReceived, availablePosts] = await Promise.all([
        prismaClient.offer.findMany({
          where: {
            companyId: companyProfile.id,
          },
          include: {
            post: {
              select: {
                id: true,
                title: true,
                type: true,
                latitude: true,
                longitude: true,
                address: true,
                userId: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        }),

        prismaClient.offer.findMany({
          where: {
            post: {
              companyId: companyProfile.id,
            },
          },
          include: {
            post: {
              select: {
                id: true,
                title: true,
                type: true,
                latitude: true,
                longitude: true,
                address: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        }),

        // Get available homeowner posts that company can make offers on
        prismaClient.post.findMany({
          where: {
            userId: { not: userId }, // Not company's own posts
            companyId: null, // Not company posts
            cityId: null, // Not city posts
            status: "AVAILABLE", // Only available posts
          },
          select: {
            id: true,
            title: true,
            type: true,
            subtype: true,
            latitude: true,
            longitude: true,
            address: true,
            price: true,
            quantity: true,
            unit: true,
            condition: true,
            images: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 20, // Limit to recent posts
        }),
      ]);

      return {
        data: {
          projects: [], // Companies don't have projects
          offersMade,
          offersReceived,
          availablePosts, // Homeowner posts available for offers
        },
      };
    } else if (role === "CITY") {
      const cityProfile = await prismaClient.cityProfile.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (!cityProfile) {
        return { error: "City profile not found" };
      }

      // Cities receive offers on their posts
      const offersReceived = await prismaClient.offer.findMany({
        where: {
          post: {
            cityId: cityProfile.id,
          },
        },
        include: {
          post: {
            select: {
              id: true,
              title: true,
              type: true,
              latitude: true,
              longitude: true,
              address: true,
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
        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        data: {
          projects: [], // Cities don't have projects
          offersMade: [], // Cities don't make offers
          offersReceived,
        },
      };
    } else {
      return { error: "Invalid user role" };
    }
  } catch (error: any) {
    console.error("Error fetching projects and offers:", error);
    return { error: `Error fetching projects and offers: ${error.message}` };
  }
}

