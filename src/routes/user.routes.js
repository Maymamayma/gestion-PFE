import express from "express";
import { loggedMiddleware } from "../middleware/auth.js";
import {
  updateUser,
  getMe,
  searchByEmail,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/search", loggedMiddleware, searchByEmail);
router.get("/me", loggedMiddleware, getMe);
router.put("/me", loggedMiddleware, updateUser);

export default router;
