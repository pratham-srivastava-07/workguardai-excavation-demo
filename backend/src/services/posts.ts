import { prismaClient } from "../db";
import { PostType, PostStatus } from "@prisma/client";

interface CreatePostInput {
  type: PostType;
  title: string;
  description?: string;
  subtype: string;
  quantity?: number;
  unit?: string;
  price?: number;
  latitude: number;
  longitude: number;
  address?: string;
  availabilityDate?: any;
  condition?: string;
  rentalDuration?: string;
  hourlyRate?: number;
  dailyRate?: number;
  pickupAllowed: boolean;
  transportNeeded: boolean;
  canCompanyCollect: boolean;
  permitForReuse: boolean;
  hazardousMaterials: boolean;
  structuralItems: boolean;
  socialLink?: string;
  images: string[];
  userId: string;
  companyId?: string;
  cityId?: string;
}

// Create a new post
export async function createPost(data: CreatePostInput) {
  try {
    const post = await prismaClient.post.create({
      data: {
        ...data,
        images: data.images,
        status: PostStatus.AVAILABLE,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        company: {
          select: {
            id: true,
            companyName: true,
            logoUrl: true,
          },
        },
        city: {
          select: {
            id: true,
            cityName: true,
            logoUrl: true,
          },
        },
      },
    });

    // Create audit log
    await prismaClient.postAuditLog.create({
      data: {
        postId: post.id,
        userId: data.userId,
        action: "CREATE",
      },
    });

    return { data: post };
  } catch (error: any) {
    console.error("Error creating post:", error);
    return { error: `Error creating post: ${error.message}` };
  }
}

// Search posts with geolocation
export async function searchPosts(params: {
  query?: string;
  type?: PostType;
  subtype?: string;
  latitude?: number;
  longitude?: number;
  radius?: number; // km
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const {
      query,
      type,
      subtype,
      latitude,
      longitude,
      radius = 50,
      minPrice,
      maxPrice,
      condition,
      page = 1,
      limit = 20,
    } = params;

    const where: any = {
      status: {
        not: PostStatus.DELETED,
      },
    };

    if (type) {
      where.type = type;
    }

    if (subtype) {
      where.subtype = {
        contains: subtype,
        mode: "insensitive",
      };
    }

    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { subtype: { contains: query, mode: "insensitive" } },
      ];
    }

    if (condition) {
      where.condition = condition;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    // Geo search - if lat/lng provided, filter by radius
    if (latitude !== undefined && longitude !== undefined) {
      // Using a simple bounding box approximation for radius search
      // For production, consider using PostGIS or a more sophisticated geo search
      const latDelta = radius / 111; // roughly 111 km per degree latitude
      const lngDelta = radius / (111 * Math.cos((latitude * Math.PI) / 180));

      where.latitude = {
        gte: latitude - latDelta,
        lte: latitude + latDelta,
      };
      where.longitude = {
        gte: longitude - lngDelta,
        lte: longitude + lngDelta,
      };
    }

    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prismaClient.post.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
          company: {
            select: {
              id: true,
              companyName: true,
              logoUrl: true,
            },
          },
          city: {
            select: {
              id: true,
              cityName: true,
              logoUrl: true,
            },
          },
          _count: {
            select: {
              offers: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prismaClient.post.count({ where }),
    ]);

    // Calculate distance if lat/lng provided
    const postsWithDistance = posts.map((post) => {
      let distance: number | null = null;
      if (latitude !== undefined && longitude !== undefined) {
        distance = calculateDistance(
          latitude,
          longitude,
          post.latitude,
          post.longitude
        );
      }
      return {
        ...post,
        distance,
      };
    });

    return {
      data: postsWithDistance,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error: any) {
    console.error("Error searching posts:", error);
    return { error: `Error searching posts: ${error.message}` };
  }
}

// Get post by ID
export async function getPostById(postId: string) {
  try {
    const post = await prismaClient.post.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        company: {
          select: {
            id: true,
            companyName: true,
            logoUrl: true,
            verified: true,
          },
        },
        city: {
          select: {
            id: true,
            cityName: true,
            logoUrl: true,
            verified: true,
          },
        },
        offers: {
          where: {
            status: "PENDING",
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
            company: {
              select: {
                id: true,
                companyName: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            offers: true,
          },
        },
      },
    });

    if (!post) {
      return { error: "Post not found" };
    }

    return { data: post };
  } catch (error: any) {
    console.error("Error fetching post:", error);
    return { error: `Error fetching post: ${error.message}` };
  }
}

// Get user's posts
export async function getUserPosts(userId: string) {
  try {
    const posts = await prismaClient.post.findMany({
      where: {
        userId,
        status: {
          not: PostStatus.DELETED,
        },
      },
      include: {
        _count: {
          select: {
            offers: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { data: posts };
  } catch (error: any) {
    console.error("Error fetching user posts:", error);
    return { error: `Error fetching user posts: ${error.message}` };
  }
}

// Update post
export async function updatePost(
  postId: string,
  userId: string,
  updates: Partial<CreatePostInput>
) {
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

    // Get old values for audit log
    const oldPost = await prismaClient.post.findUnique({
      where: { id: postId },
    });

    const updatedPost = await prismaClient.post.update({
      where: { id: postId },
      data: {
        ...updates,
        images: updates.images ? updates.images : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        company: {
          select: {
            id: true,
            companyName: true,
            logoUrl: true,
          },
        },
        city: {
          select: {
            id: true,
            cityName: true,
            logoUrl: true,
          },
        },
      },
    });

    // Create audit logs for changed fields
    if (oldPost) {
      const changes: Array<{ field: string; old: any; new: any }> = [];
      Object.keys(updates).forEach((key) => {
        const typedKey = key as keyof typeof updates;
        if (updates[typedKey] !== undefined && oldPost[typedKey] !== updates[typedKey]) {
          changes.push({
            field: key,
            old: oldPost[typedKey],
            new: updates[typedKey],
          });
        }
      });

      // Create audit log entries
      await Promise.all(
        changes.map((change) =>
          prismaClient.postAuditLog.create({
            data: {
              postId,
              userId,
              action: "UPDATE",
              fieldName: change.field,
              oldValue: JSON.stringify(change.old),
              newValue: JSON.stringify(change.new),
            },
          })
        )
      );
    }

    return { data: updatedPost };
  } catch (error: any) {
    console.error("Error updating post:", error);
    return { error: `Error updating post: ${error.message}` };
  }
}

// Delete post (soft delete)
export async function deletePost(postId: string, userId: string) {
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

    const deletedPost = await prismaClient.post.update({
      where: { id: postId },
      data: {
        status: PostStatus.DELETED,
      },
    });

    // Create audit log
    await prismaClient.postAuditLog.create({
      data: {
        postId,
        userId,
        action: "DELETE",
      },
    });

    return { data: deletedPost };
  } catch (error: any) {
    console.error("Error deleting post:", error);
    return { error: `Error deleting post: ${error.message}` };
  }
}

// Update post status
export async function updatePostStatus(
  postId: string,
  userId: string,
  status: PostStatus
) {
  try {
    const post = await prismaClient.post.findUnique({
      where: { id: postId },
      select: { userId: true, status: true },
    });

    if (!post) {
      return { error: "Post not found" };
    }

    if (post.userId !== userId) {
      return { error: "Unauthorized: You don't own this post" };
    }

    const updatedPost = await prismaClient.post.update({
      where: { id: postId },
      data: { status },
    });

    // Create audit log
    await prismaClient.postAuditLog.create({
      data: {
        postId,
        userId,
        action: "STATUS_CHANGE",
        fieldName: "status",
        oldValue: JSON.stringify(post.status),
        newValue: JSON.stringify(status),
      },
    });

    return { data: updatedPost };
  } catch (error: any) {
    console.error("Error updating post status:", error);
    return { error: `Error updating post status: ${error.message}` };
  }
}

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

