import express from "express";
import {
  createProject,
  fetchAllProjects,
  fetchProjectById,
  deleteProject,
  updateProject,
  getProjectDashboard,
} from "../controllers/project.controller.js";

const router = express.Router();
router.get("/:id/dashboard", getProjectDashboard);
router.post("/", createProject);
router.get("/", fetchAllProjects);
router.get("/:id", fetchProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
