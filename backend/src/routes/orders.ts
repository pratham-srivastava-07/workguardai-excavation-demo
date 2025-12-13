import express from "express";
import { getOrdersController } from "../controllers/orders";
import requireRole from "../middlewares/role";

export const ordersRouter = express.Router();

ordersRouter.get("/", requireRole(["COMPANY", "CITY"]), getOrdersController);

