import express from "express";
import { loggedMiddleware } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import {
  getSprintById,
  updateSprint,
  deleteSprint,
  getSprintDashboard,
} from "../controllers/sprint.controller.js";
const router = express.Router();

// Get sprint by ID
router.get(
  "/:sprintId",
  loggedMiddleware,
  requireRole("etudiant"),
  getSprintById
);

// Update sprint
router.put(
  "/:sprintId",
  loggedMiddleware,
  requireRole("etudiant"),
  updateSprint
);

// Delete sprint
router.delete(
  "/:sprintId",
  loggedMiddleware,
  requireRole("etudiant"),
  deleteSprint
);

router.get(
  "/:sprintId/dashboard",
  loggedMiddleware,
  requireRole("etudiant", "encad_universitaire", "encad_entreprise"),
  getSprintDashboard
);

export default router;
