// src/routes/report.routes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadReport");

const { uploadReportVersion } = require("../controllers/report.controller");

// UPLOAD new Version
router.post(
  "/projects/:projectId/reports/upload",
  upload.single("pdf"),
  uploadReportVersion
);

module.exports = router;
