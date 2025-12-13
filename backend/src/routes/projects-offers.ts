import express from "express";
import { getUserProjectsAndOffersController } from "../controllers/projects-offers";

export const projectsOffersRouter = express.Router();

projectsOffersRouter.get("/", getUserProjectsAndOffersController);

