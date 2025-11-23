// src/routes/reportHistory.routes.js
const express = require("express");
const router = express.Router();

const {
  listHistory,
  downloadReport,
} = require("../controllers/reportHistory.controller");

// List all report versions for a project
router.get("/projects/:projectId/reports", listHistory);

// Download a specific report version
router.get("projects/:projectId/reports/:reportId/download", downloadReport);

module.exports = router;
