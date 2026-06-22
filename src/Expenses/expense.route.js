import { Router } from "express";
import {
  getExpenses,
  getAllExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "./expense.controller.js";
import authMiddleware from "../Middleware/auth.middleware.js";

const expenseRouter = Router();

expenseRouter.use(authMiddleware);

expenseRouter.get("/", getExpenses);
expenseRouter.get("/all", getAllExpenses);
expenseRouter.post("/", createExpense);
expenseRouter.put("/:id", updateExpense);
expenseRouter.delete("/:id", deleteExpense);

export default expenseRouter;
