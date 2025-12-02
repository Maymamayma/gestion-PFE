import express from "express";
import { generateSprintReport } from "../controllers/sprintReport.controller.js";

const router = express.Router();

// Générer rapport HTML pour un sprint
router.get(
  "/projects/:projectId/sprints/:sprintId/report",
  generateSprintReport
);

export { router };
