// src/routes/reportHistory.routes.js
const express = require("express");
const router = express.Router();

const {
  getRapportsByProjectId,
  downloadRapport,
  getRapportStats,
  deleteRapport,
} = require("../controllers/reportHistory.controller");

const { authenticate, authorize } = require("../middleware/auth");

// LIST all versions
router.get(
  "/projects/:projectId/reports",
  authenticate,
  getRapportsByProjectId
);

// DOWNLOAD a version
router.get(
  "/projects/:projectId/reports/download/:reportId",
  authenticate,
  downloadRapport
);

// STATS
router.get("/projects/:projectId/reports/stats", authenticate, getRapportStats);

// DELETE a version
router.delete(
  "/projects/:projectId/reports/:reportId",
  authenticate,
  authorize("ETUDIANT"),
  deleteRapport
);

module.exports = router;
