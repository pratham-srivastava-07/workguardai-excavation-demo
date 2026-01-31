import express from "express"
import { contractorRouter } from "./contractor";
import { projectRouter } from "./projects";
import { postRouter } from "./posts";
import { dashboardRouter } from "./dashboard";
import { ordersRouter } from "./orders";
import { projectsOffersRouter } from "./projects-offers";
import { offersRouter } from "./offers";
import authMiddleware from "../middlewares/auth";
import requireRole from "../middlewares/role";

export const router = express.Router();

// Public routes (no auth required)
// router.use("/public", publicRouter);

// Protected routes (auth required)
router.use("/contractors", authMiddleware, requireRole(["CONTRACTOR"]), contractorRouter);
router.use("/projects", authMiddleware, projectRouter);
router.use("/posts", postRouter);
router.use("/dashboard", authMiddleware, dashboardRouter);
router.use("/orders", authMiddleware, ordersRouter);
router.use("/offers", authMiddleware, offersRouter);
// router.use("/messages", authMiddleware, messagesRouter);
router.use("/projects-offers", authMiddleware, projectsOffersRouter);