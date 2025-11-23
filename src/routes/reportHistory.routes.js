// src/routes/reportHistory.routes.js
const express = require("express");
const router = express.Router();

const {
  getRapportsByProjectId,
  downloadRapport,
  deleteRapport,
  getReportHistory,
} = require("../controllers/reportHistory.controller");

const { authenticate, authorize } = require("../middleware/auth");

// LIST all versions
router.get("/reports", getRapportsByProjectId);

// DOWNLOAD a version
router.get("/reports/download/:reportId", downloadRapport);

// DELETE a version
router.delete("/reports/:reportId", deleteRapport);

router.get("/reports", getReportHistory);

module.exports = router;
