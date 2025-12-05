import express from "express";
import { loggedMiddleware } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import {
  createProject,
  fetchAllProjects,
  fetchProjectById,
  deleteProject,
  updateProject,
  getProjectDashboard,
} from "../controllers/project.controller.js";

const router = express.Router();
router.get(
  "/:id/dashboard",
  loggedMiddleware,
  requireRole("etudiant", "encad_universitaire", "encad_entreprise"),
  getProjectDashboard
);
router.post("/", loggedMiddleware, requireRole("etudiant"), createProject);
router.get(
  "/",
  loggedMiddleware,
  requireRole("etudiant", "encad_universitaire", "encad_entreprise"),
  fetchAllProjects
);
router.get(
  "/:id",
  loggedMiddleware,
  requireRole("etudiant", "encad_universitaire", "encad_entreprise"),
  fetchProjectById
);
router.put("/:id", loggedMiddleware, requireRole("etudiant"), updateProject);
router.delete("/:id", loggedMiddleware, requireRole("etudiant"), deleteProject);
export default router;
