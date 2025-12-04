import express from "express";
import {
  createSprint,
  getProjectSprints,
  getSprintById,
  updateSprint,
  deleteSprint,
} from "../controllers/sprint.controller.js";
import { isStudent, loggedMiddleware } from "../middlewares/auth.js";

export const router = express.Router();

// Create sprint
router.post("/projects/:projectId/sprints",loggedMiddleware ,isStudent , createSprint);

// List all sprints of a project
router.get("/projects/:projectId/sprints",loggedMiddleware , getProjectSprints);

// Get sprint by ID
router.get("/sprints/:sprintId",loggedMiddleware , getSprintById);

// Update sprint
router.put("/sprints/:sprintId",loggedMiddleware ,isStudent , updateSprint);

// Delete sprint
router.delete("/sprints/:sprintId",loggedMiddleware ,isStudent , deleteSprint);
