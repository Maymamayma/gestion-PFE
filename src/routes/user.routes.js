import express from "express";
import * as userController from "../controllers/user.controller.js";

export const router = express.Router();

router.post("/signup", userController.signup);
router.post("/login", userController.login);
