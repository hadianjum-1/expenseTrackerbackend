import { Router } from "express";
import { getProfile, updateProfile, changePassword } from "./profile.controller.js";
import authMiddleware from "../Middleware/auth.middleware.js";

const profileRouter = Router();

profileRouter.use(authMiddleware);

profileRouter.get("/", getProfile);
profileRouter.put("/", updateProfile);
profileRouter.put("/change-password", changePassword);

export default profileRouter;
