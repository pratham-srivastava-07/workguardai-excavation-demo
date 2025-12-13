import { Request, Response } from "express";
import {
  createPost,
  searchPosts,
  getPostById,
  getUserPosts,
  updatePost,
  deletePost,
  updatePostStatus,
} from "../services/posts";
import { postCreateSchema, postUpdateSchema, postSearchSchema } from "../utils/zod";
import { PostType, PostStatus } from "@prisma/client";

export async function createPostController(req: Request, res: Response) {
  const parsedBody = postCreateSchema.safeParse(req.body);

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

  // ✅ FILE VALIDATION (NOT ZOD)
  const files: any = req.files as Express.Multer.File[];
  const availabilityDate = parsedBody.data.availabilityDate || undefined;

  // Convert uploaded files to base64 data URLs
  const imageUrls: string[] = [];
  if (files && files.length > 0) {
    for (const file of files) {
      if (file.buffer) {
        const base64 = file.buffer.toString('base64');
        const mimeType = file.mimetype || 'image/jpeg';
        imageUrls.push(`data:${mimeType};base64,${base64}`);
      }
    }
  }

  try {
    const result = await createPost({
      ...parsedBody.data,
      availabilityDate,
      userId,
      images: imageUrls, // pass base64 URLs to service
    });

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    return res.status(201).json({
      message: "Post created successfully",
      data: result.data,
    });
  } catch (error) {
    console.error("Error in createPostController:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


export async function searchPostsController(req: Request, res: Response) {
  const parsedQuery = postSearchSchema.safeParse(req.query);

  if (!parsedQuery.success) {
    return res.status(400).json({
      message: "Invalid query parameters",
      error: parsedQuery.error.flatten(),
    });
  }

  try {
    const result = await searchPosts(parsedQuery.data);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Error in searchPostsController:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getPostByIdController(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const result = await getPostById(id);

    if (result.error) {
      return res.status(404).json({ message: result.error });
    }

    return res.status(200).json({ data: result.data });
  } catch (error: any) {
    console.error("Error in getPostByIdController:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getUserPostsController(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const result = await getUserPosts(userId);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    return res.status(200).json({ data: result.data });
  } catch (error: any) {
    console.error("Error in getUserPostsController:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updatePostController(req: Request, res: Response) {
  const { id } = req.params;
  const parsedBody = postUpdateSchema.safeParse(req.body);

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
    const updates: any = { ...parsedBody.data };
    if (updates.availabilityDate) {
      updates.availabilityDate = new Date(updates.availabilityDate);
    }

    const result = await updatePost(id, userId, updates);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    return res.status(200).json({
      message: "Post updated successfully",
      data: result.data,
    });
  } catch (error: any) {
    console.error("Error in updatePostController:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function deletePostController(req: Request, res: Response) {
  const { id } = req.params;
  const userId = (req as any).user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const result = await deletePost(id, userId);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    return res.status(200).json({
      message: "Post deleted successfully",
      data: result.data,
    });
  } catch (error: any) {
    console.error("Error in deletePostController:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updatePostStatusController(req: Request, res: Response) {
  const { id } = req.params;
  const { status } = req.body;
  const userId = (req as any).user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!Object.values(PostStatus).includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const result = await updatePostStatus(id, userId, status);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    return res.status(200).json({
      message: "Post status updated successfully",
      data: result.data,
    });
  } catch (error: any) {
    console.error("Error in updatePostStatusController:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

