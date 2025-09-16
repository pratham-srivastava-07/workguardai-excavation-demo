import express from "express"
import { contractorRouter } from "./contractor";
import { projectRouter } from "./projects";
import authMiddleware from "../middlewares/auth";
import requireRole from "../middlewares/role";

export const router = express.Router();

router.use("/contractors", authMiddleware, requireRole(["CONTRACTOR"]), contractorRouter);
router.use("/projects", authMiddleware, projectRouter);