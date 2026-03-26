import express from "express";
import { loggedMiddleware } from "../middleware/auth.js";
import {
  updateUser,
  getMe,
  searchByEmail,
  changePassword,
} from "../controllers/user.controller.js";

console.log("updateUser:", typeof updateUser); // should be "function"
console.log("loggedMiddleware:", typeof loggedMiddleware);
const router = express.Router();

router.get("/search", loggedMiddleware, searchByEmail);
router.get("/me", loggedMiddleware, getMe);
router.put("/:id/password", loggedMiddleware, changePassword);
router.put("/:id", loggedMiddleware, updateUser);

export default router;
