import { prismaClient } from "../db";
import { Role, PostType, PostStatus, OfferStatus } from "@prisma/client";

// Get orders for Company or City
// Orders are: accepted offers on material/space/service posts they received
export async function getOrders(userId: string, role: Role) {
  try {
    if (role === "COMPANY") {
      const companyProfile = await prismaClient.companyProfile.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (!companyProfile) {
        return { error: "Company profile not found" };
      }

      // Orders = accepted offers on material/space/service posts posted by the company
      const orders = await prismaClient.offer.findMany({
        where: {
          post: {
            companyId: companyProfile.id,
            type: { in: [PostType.MATERIAL, PostType.SPACE, PostType.SERVICE] },
          },
          status: OfferStatus.ACCEPTED,
        },
        include: {
          post: {
            select: {
              id: true,
              title: true,
              type: true,
              subtype: true,
              latitude: true,
              longitude: true,
              address: true,
              quantity: true,
              unit: true,
              price: true,
              images: true,
              status: true,
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
      });

      return { data: orders };
    } else if (role === "CITY") {
      const cityProfile = await prismaClient.cityProfile.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (!cityProfile) {
        return { error: "City profile not found" };
      }

      // Orders = accepted offers on material/space posts posted by the city
      const orders = await prismaClient.offer.findMany({
        where: {
          post: {
            cityId: cityProfile.id,
            type: { in: [PostType.MATERIAL, PostType.SPACE] },
          },
          status: OfferStatus.ACCEPTED,
        },
        include: {
          post: {
            select: {
              id: true,
              title: true,
              type: true,
              subtype: true,
              latitude: true,
              longitude: true,
              address: true,
              quantity: true,
              unit: true,
              price: true,
              images: true,
              status: true,
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
      });

      return { data: orders };
    } else {
      return { error: "Orders are only available for Company and City roles" };
    }
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return { error: `Error fetching orders: ${error.message}` };
  }
}

