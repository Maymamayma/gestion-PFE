import express from "express";
import upload from "../middleware/uploadReport.js";
import { uploadReportVersion } from "../controllers/report.controller.js";

const router = express.Router();

// UPLOAD new Version
router.post(
  "/projects/:projectId/reports/upload",
  upload.single("pdf"),
  uploadReportVersion
);

export { router };
