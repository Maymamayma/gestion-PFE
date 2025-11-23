// src/routes/userstoryPriority.routes.js
const express = require("express");
const router = express.Router();

const {
  updatePriority,
  listSorted,
} = require("../controllers/userstoryPriority.controller");

// Change priority
router.patch(
  "/projects/:projectId/sprints/:sprintId/userStories/:userStoryId/priority",
  updatePriority
);

// Get stories sorted by priority
router.get(
  "/projects/:projectId/sprints/:sprintId/userStories/sorted/by-priority",
  listSorted
);

module.exports = router;
