import { Router } from "express";
import {
  getIncome,
  getAllIncome,
  createIncome,
  updateIncome,
  deleteIncome,
} from "./income.controller.js";
import authMiddleware from "../Middleware/auth.middleware.js";

const incomeRouter = Router();

incomeRouter.use(authMiddleware);

incomeRouter.get("/", getIncome);
incomeRouter.get("/all", getAllIncome);
incomeRouter.post("/", createIncome);
incomeRouter.put("/:id", updateIncome);
incomeRouter.delete("/:id", deleteIncome);

export default incomeRouter;
