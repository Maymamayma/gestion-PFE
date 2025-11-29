const express = require("express");
const router = express.Router();
const { generateProjectReport } = require("../controllers/projectReport.controller");

// Générer rapport HTML global pour un projet
router.get("/projects/:projectId/report", generateProjectReport);

module.exports = router;