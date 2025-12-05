import express from "express";
import {
  createSprint,
  getProjectSprints,
  getSprintById,
  updateSprint,
  deleteSprint,
} from "../controllers/sprint.controller.js";
import { loggedMiddleware } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
const router = express.Router();

// Create sprint
//TODO : add isStudent later
router.post("/projects/:projectId/sprints", createSprint);

// List all sprints of a project
router.get("/projects/:projectId/sprints", getProjectSprints);

// Get sprint by ID
router.get("/sprints/:sprintId", getSprintById);

// Update sprint
router.put("/sprints/:sprintId", updateSprint);

// Delete sprint
router.delete("/sprints/:sprintId", deleteSprint);

export default router;
