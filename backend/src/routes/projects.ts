import express from "express";
import registerProject, { 
  browseProjects, 
  getEstimateController,
  getProjectDetails,
  updateProject
} from "../controllers/projects";
import { validateBody } from "../middlewares/validate";
import { projectBodySchema, projectUpdateSchema } from "../utils/zod";

export const projectRouter = express.Router();

// Public routes
projectRouter.get("/estimate", getEstimateController); // Get cost estimate
projectRouter.get("/browse", browseProjects); // Public project browsing


// Project CRUD
projectRouter.route("/")
  .get(browseProjects) // Get user's projects (role-based)
  .post(validateBody(projectBodySchema), registerProject); // Create new project

projectRouter.route("/:id")
  .get(getProjectDetails) // Get single project details
  .put(validateBody(projectUpdateSchema), updateProject); // Update project (homeowner only)