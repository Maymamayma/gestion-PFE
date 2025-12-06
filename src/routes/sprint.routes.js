import express from "express";
import { loggedMiddleware } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import {
  getSprintById,
  updateSprint,
  deleteSprint,
  getSprintDashboard,
  createSprint,
} from "../controllers/sprint.controller.js";
const router = express.Router();

// Get sprint by ID
router.get("/:sprintId", loggedMiddleware, getSprintById);

// Update sprint
router.put("/:sprintId", loggedMiddleware, updateSprint);

// Delete sprint
router.delete("/:sprintId", loggedMiddleware, deleteSprint);

router.get(
  "/:sprintId/dashboard",
  loggedMiddleware,
  requireRole("etudiant", "encad_universitaire", "encad_entreprise"),
  getSprintDashboard
);

export default router;
