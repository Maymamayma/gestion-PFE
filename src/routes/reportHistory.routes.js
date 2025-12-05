import express from "express";

const router = express.Router();

import {
  listHistory,
  downloadReport,
} from "../controllers/reportHistory.controller.js";

router.get("/projects/:projectId/reports", listHistory);
router.get("/projects/:projectId/reports/:reportId/download", downloadReport);

export { router };
