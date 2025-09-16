import express from "express"
import registerProject, { browseProjects, getEstimateController } from "../controllers/projects";
import { validateBody } from "../middlewares/validate";
import { projectBodySchema } from "../utils/zod";

export const projectRouter = express.Router()

projectRouter.route("/")
.get(browseProjects)
.post(validateBody(projectBodySchema), registerProject)

projectRouter.get("/:id", getEstimateController);