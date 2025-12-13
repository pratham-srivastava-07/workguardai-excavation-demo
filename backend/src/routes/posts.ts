import express from "express";
import {
  createPostController,
  searchPostsController,
  getPostByIdController,
  getUserPostsController,
  updatePostController,
  deletePostController,
  updatePostStatusController,
} from "../controllers/posts";
import {
  createOfferController,
  getPostOffersController,
  updateOfferStatusController,
  updateOfferController,
} from "../controllers/offers";
import { validateBody } from "../middlewares/validate";
import { postCreateSchema, postUpdateSchema, offerCreateSchema } from "../utils/zod";
import authMiddleware from "../middlewares/auth";
import multer from "multer"

const upload = multer({ storage: multer.memoryStorage() });

export const postRouter = express.Router();

// Public routes
postRouter.get("/search", searchPostsController);
postRouter.get("/:id", getPostByIdController);

// Protected routes
postRouter.use(authMiddleware);

postRouter.get("/", getUserPostsController);
postRouter.post("/", upload.array('images', 6), createPostController);
postRouter.put("/:id", updatePostController);
postRouter.delete("/:id", deletePostController);
postRouter.patch("/:id/status", updatePostStatusController);

// Offer routes
postRouter.post("/:postId/offers", validateBody(offerCreateSchema), createOfferController);
postRouter.get("/:postId/offers", getPostOffersController);
postRouter.patch("/offers/:id/status", updateOfferStatusController);
postRouter.put("/offers/:id", updateOfferController);

