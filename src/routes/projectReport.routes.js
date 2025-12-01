import express from "express";
import * as generateProjectReport from "../controllers/projectReport.controller.js";

export const router = express.Router();

router.get("/projects/:projectId/report", generateProjectReport);
//const express = require("express");
//const router = express.Router();
//const { generateProjectReport } = require("../controllers/projectReport.controller");

// Générer rapport HTML global pour un projet
//router.get("/projects/:projectId/report", generateProjectReport);

//module.exports = router;