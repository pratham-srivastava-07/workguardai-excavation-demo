import { prismaClient } from "../db";
import { Role, PostType, PostStatus, OfferStatus, Project } from "@prisma/client";

// Homeowner Dashboard Stats
export async function getHomeownerDashboardStats(userId: string) {
  try {
    const [
      totalPosts,
      activeProjects,
      pendingOffers,
      completedProjects,
      recentProjects,
      recentPosts,
    ] = await Promise.all([
      // Total posts created
      prismaClient.post.count({
        where: {
          userId,
          status: { not: PostStatus.DELETED },
        },
      }),

      // Active projects (IN_PROGRESS)
      prismaClient.project.count({
        where: {
          homeownerId: userId,
          status: "IN_PROGRESS",
        },
      }),

      // Pending offers received
      prismaClient.offer.count({
        where: {
          post: {
            userId,
          },
          status: OfferStatus.PENDING,
        },
      }),

      // Completed projects
      prismaClient.project.count({
        where: {
          homeownerId: userId,
          status: "COMPLETED",
        },
      }),

      // Recent projects
      prismaClient.project.findMany({
        where: {
          homeownerId: userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        select: {
          id: true,
          title: true,
          status: true,
          budgetMin: true,
          budgetMax: true,
          size: true,
          createdAt: true,
        },
      }),

      // Recent posts
      prismaClient.post.findMany({
        where: {
          userId,
          status: { not: PostStatus.DELETED },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        select: {
          id: true,
          title: true,
          type: true,
          status: true,
          quantity: true,
          unit: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      data: {
        stats: {
          totalPosts,
          activeProjects,
          pendingOffers,
          completedProjects,
        },
        recentProjects,
        recentPosts,
      },
    };
  } catch (error: any) {
    console.error("Error fetching homeowner dashboard stats:", error);
    return { error: `Error fetching dashboard stats: ${error.message}` };
  }
}

// Company Dashboard Stats
export async function getCompanyDashboardStats(userId: string) {
  try {
    // Get company profile
    const companyProfile = await prismaClient.companyProfile.findUnique({
      where: { userId },
      select: { id: true, companyName: true, description: true, verified: true },
    });

    if (!companyProfile) {
      return { error: "Company profile not found" };
    }

    const [
      activeOffers,
      totalPosts,
      pendingOffers,
      ordersInProgress,
      recentOffers,
      recentPosts,
    ] = await Promise.all([
      // Active offers made by company
      prismaClient.offer.count({
        where: {
          companyId: companyProfile.id,
          status: { in: [OfferStatus.PENDING, OfferStatus.ACCEPTED] },
        },
      }),

      // Total service/material posts
      prismaClient.post.count({
        where: {
          companyId: companyProfile.id,
          status: { not: PostStatus.DELETED },
        },
      }),

      // Pending offers received on company posts
      prismaClient.offer.count({
        where: {
          post: {
            companyId: companyProfile.id,
          },
          status: OfferStatus.PENDING,
        },
      }),

      // Orders in progress (accepted offers on company posts)
      prismaClient.offer.count({
        where: {
          post: {
            companyId: companyProfile.id,
            type: { in: [PostType.MATERIAL, PostType.SPACE, PostType.SERVICE] },
          },
          status: OfferStatus.ACCEPTED,
        },
      }),

      // Recent offers made
      prismaClient.offer.findMany({
        where: {
          companyId: companyProfile.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        include: {
          post: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      }),

      // Recent posts
      prismaClient.post.findMany({
        where: {
          companyId: companyProfile.id,
          status: { not: PostStatus.DELETED },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        select: {
          id: true,
          title: true,
          type: true,
          status: true,
          dailyRate: true,
          hourlyRate: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      data: {
        companyInfo: companyProfile,
        stats: {
          activeOffers,
          totalPosts,
          pendingOffers,
          ordersInProgress,
        },
        recentOffers,
        recentPosts,
      },
    };
  } catch (error: any) {
    console.error("Error fetching company dashboard stats:", error);
    return { error: `Error fetching dashboard stats: ${error.message}` };
  }
}

// City Dashboard Stats
export async function getCityDashboardStats(userId: string) {
  try {
    // Get city profile
    const cityProfile = await prismaClient.cityProfile.findUnique({
      where: { userId },
      select: { id: true, cityName: true, description: true, verified: true },
    });

    if (!cityProfile) {
      return { error: "City profile not found" };
    }

    const [
      totalPosts,
      materialsRecycled,
      hazardousMaterials,
      activePickups,
      recentPosts,
    ] = await Promise.all([
      // Total material/space posts
      prismaClient.post.count({
        where: {
          cityId: cityProfile.id,
          status: { not: PostStatus.DELETED },
          type: { in: [PostType.MATERIAL, PostType.SPACE] },
        },
      }),

      // Materials recycled (accepted offers on city posts)
      prismaClient.offer.count({
        where: {
          post: {
            cityId: cityProfile.id,
            type: PostType.MATERIAL,
          },
          status: OfferStatus.ACCEPTED,
        },
      }),

      // Hazardous materials posts
      prismaClient.post.count({
        where: {
          cityId: cityProfile.id,
          hazardousMaterials: true,
          status: { not: PostStatus.DELETED },
        },
      }),

      // Active pickups (accepted offers)
      prismaClient.offer.count({
        where: {
          post: {
            cityId: cityProfile.id,
          },
          status: OfferStatus.ACCEPTED,
        },
      }),

      // Recent posts
      prismaClient.post.findMany({
        where: {
          cityId: cityProfile.id,
          status: { not: PostStatus.DELETED },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        select: {
          id: true,
          title: true,
          type: true,
          subtype: true,
          status: true,
          quantity: true,
          unit: true,
          hazardousMaterials: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      data: {
        cityInfo: cityProfile,
        stats: {
          totalPosts,
          materialsRecycled,
          hazardousMaterials,
          activePickups,
        },
        recentPosts,
      },
    };
  } catch (error: any) {
    console.error("Error fetching city dashboard stats:", error);
    return { error: `Error fetching dashboard stats: ${error.message}` };
  }
}

