import express from "express";
import { loggedMiddleware } from "../middleware/auth.js";
import { updateUser, getMe } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/me", loggedMiddleware, getMe);
router.put("/me", loggedMiddleware, updateUser);

export default router;
