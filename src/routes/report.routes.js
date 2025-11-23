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
router.post("/reports/upload", uploadRapport);

// GET metadata of one report version
router.get("/reports/:reportId", getRapportById);

// UPDATE notes of one version
router.patch("/reports/:reportId", updateRapportNotes);

module.exports = router;
