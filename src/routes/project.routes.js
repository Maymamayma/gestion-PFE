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

import {
  createSprint,
  getProjectSprints,
} from "../controllers/sprint.controller.js";

const router = express.Router();
router.get(
  "/:projectId/dashboard",
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
  "/:projectId",
  loggedMiddleware,
  requireRole("etudiant", "encad_universitaire", "encad_entreprise"),
  fetchProjectById
);
router.put(
  "/:projectId",
  loggedMiddleware,
  requireRole("etudiant"),
  updateProject
);
router.delete(
  "/:projectId",
  loggedMiddleware,
  requireRole("etudiant"),
  deleteProject
);

//---------------------------sprint ---------------------------
// Create sprint
router.post(
  "/:projectId/sprints",
  loggedMiddleware,
  requireRole("etudiant"),
  createSprint
);

// List all sprints of a project
router.get("/:projectId/sprints", loggedMiddleware, getProjectSprints);

export default router;
