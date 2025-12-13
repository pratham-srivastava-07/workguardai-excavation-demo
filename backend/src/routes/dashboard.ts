import express from "express";
import { getDashboardStatsController } from "../controllers/dashboard";

export const dashboardRouter = express.Router();

dashboardRouter.get("/stats", getDashboardStatsController);

