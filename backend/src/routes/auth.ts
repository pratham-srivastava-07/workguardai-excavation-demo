import express from "express"
import signupController, { logoutController, signinController } from "../controllers/auth"

export const authRouter = express.Router()

authRouter.post("/signup", signupController);
authRouter.post("/login", signinController);
authRouter.post("/logout", logoutController);