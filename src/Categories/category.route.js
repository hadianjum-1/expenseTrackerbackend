import { Router } from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./category.controller.js";
import authMiddleware from "../Middleware/auth.middleware.js";

const categoryRouter = Router();

categoryRouter.use(authMiddleware);

categoryRouter.get("/", getCategories);
categoryRouter.post("/", createCategory);
categoryRouter.put("/:id", updateCategory);
categoryRouter.delete("/:id", deleteCategory);

export default categoryRouter;
