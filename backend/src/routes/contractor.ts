import express from "express"
import registerController, { profileController, updateContractorController } from "../controllers/contractor";

export const contractorRouter = express.Router()

contractorRouter
.route("/:id")
.put(updateContractorController)
.get(profileController);

contractorRouter.post("/", registerController)