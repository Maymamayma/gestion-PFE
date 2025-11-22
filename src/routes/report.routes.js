// src/routes/report.routes.js
const express = require("express");
const router = express.Router();

const {
  uploadRapport,
  getRapportById,
  updateRapportNotes,
} = require("../controllers/report.controller");

const { authenticate, authorize } = require("../middleware/auth");
const { uploadSingleReport } = require("../middleware/multer");

// UPLOAD new Version
router.post(
  "/projects/:projectId/reports",
  authenticate,
  authorize("ETUDIANT"),
  uploadSingleReport,
  uploadRapport
);

// GET metadata of one report version
router.get(
  "/projects/:projectId/reports/:reportId",
  authenticate,
  getRapportById
);

// UPDATE notes of one version
router.patch(
  "/projects/:projectId/reports/:reportId",
  authenticate,
  authorize("ETUDIANT"),
  updateRapportNotes
);

module.exports = router;
