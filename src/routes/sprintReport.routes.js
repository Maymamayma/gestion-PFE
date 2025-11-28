const express = require("express");
const router = express.Router();
const { generateSprintReport } = require("../controllers/sprintReport.controller");

// Générer rapport HTML pour un sprint
router.get("/projects/:projectId/sprints/:sprintId/report", generateSprintReport);

module.exports = router;