import { Router } from "express";
import { getDashboardStats, getDashboardCharts } from "./dashboard.controller.js";
import authMiddleware from "../Middleware/auth.middleware.js";

const dashboardRouter = Router();

dashboardRouter.use(authMiddleware);

dashboardRouter.get("/stats", getDashboardStats);
dashboardRouter.get("/charts", getDashboardCharts);

export default dashboardRouter;
