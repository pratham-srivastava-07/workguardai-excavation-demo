import express from "express";
import { 
  createOfferController, 
  getPostOffersController, 
  updateOfferStatusController, 
  updateOfferController 
} from "../controllers/offers";
import authMiddleware from "../middlewares/auth";

export const offersRouter = express.Router();

// Apply auth middleware to all routes
offersRouter.use(authMiddleware);

// Create a new offer
offersRouter.post("/", createOfferController);

// Get all offers for a post
offersRouter.get("/post/:postId", getPostOffersController);

// Update offer status (accept/reject)
offersRouter.patch("/:id/status", updateOfferStatusController);

// Update offer details
offersRouter.put("/:id", updateOfferController);

// Accept an offer
offersRouter.post("/:id/accept", async (req, res) => {
  req.body.status = 'ACCEPTED';
  return updateOfferStatusController(req, res);
});

// Reject an offer
offersRouter.post("/:id/reject", async (req, res) => {
  req.body.status = 'REJECTED';
  return updateOfferStatusController(req, res);
});
