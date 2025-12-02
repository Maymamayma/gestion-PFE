import express from "express";
import {
  createProject,
  fetchAllProjects,
  fetchProjectById,
  deleteProject,
  updateProject,
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/", createProject);
router.get("/", fetchAllProjects);
router.get("/:id", fetchProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
