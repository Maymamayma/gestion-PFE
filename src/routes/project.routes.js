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
  getAccountStats,
  addProjectMember,
  getProjectMembers,
  removeProjectMember,
} from "../controllers/project.controller.js";

import {
  createSprint,
  getProjectSprints,
} from "../controllers/sprint.controller.js";

import upload from "../middleware/uploadReport.js";
import { uploadReportVersion } from "../controllers/report.controller.js";
import { listHistory, downloadReport } from "../controllers/reportHistory.controller.js";

const router = express.Router();
router.get(
  "/:projectId/dashboard",
  loggedMiddleware,
  requireRole("etudiant", "encad_universitaire", "encad_entreprise"),
  getProjectDashboard,
);
router.post("/", loggedMiddleware, requireRole("etudiant"), createProject);

router.get(
  "/stats",
  loggedMiddleware,
  requireRole("etudiant"),
  getAccountStats,
);
router.get(
  "/",
  loggedMiddleware,
  requireRole("etudiant", "encad_universitaire", "encad_entreprise"),
  fetchAllProjects,
);
router.get(
  "/:projectId",
  loggedMiddleware,
  requireRole("etudiant", "encad_universitaire", "encad_entreprise"),
  fetchProjectById,
);
router.put(
  "/:projectId",
  loggedMiddleware,
  requireRole("etudiant"),
  updateProject,
);
router.delete(
  "/:projectId",
  loggedMiddleware,
  requireRole("etudiant"),
  deleteProject,
);

// Add member to project
router.post(
  "/:projectId/members",
  loggedMiddleware,
  requireRole("etudiant"),
  addProjectMember,
);

// Get project members
router.get(
  "/:projectId/members",
  loggedMiddleware,
  requireRole("etudiant", "encad_universitaire", "encad_entreprise"),
  getProjectMembers,
);

// Remove member from project
router.delete(
  "/:projectId/members/:userId",
  loggedMiddleware,
  requireRole("etudiant"),
  removeProjectMember,
);

//---------------------------sprint ---------------------------
// Create sprint
router.post(
  "/:projectId/sprints",
  loggedMiddleware,
  requireRole("etudiant"),
  createSprint,
);

// List all sprints of a project
router.get("/:projectId/sprints", loggedMiddleware, getProjectSprints);

// --- new report routes ---
router.post(
  "/:projectId/reports/upload",
  loggedMiddleware,
  requireRole("etudiant"),
  upload.single("pdf"),
  uploadReportVersion
);

router.get(
  "/:projectId/reports",
  loggedMiddleware,
  requireRole("etudiant", "encad_universitaire"),
  listHistory
);

router.get(
  "/:projectId/reports/:reportId/download",
  loggedMiddleware,
  requireRole("etudiant", "encad_universitaire"),
  downloadReport
);

export default router;
