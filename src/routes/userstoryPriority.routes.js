// src/routes/userstoryPriority.routes.js
const express = require("express");
const router = express.Router();

const {
  getUserStoriesByPriority,
  updateUserStoryPriority,
  getUserStoriesStatsByPriority,
} = require("../controllers/userstoryPriority.controller");

const { authenticate, authorize } = require("../middleware/auth");

// FILTER + SORT + PAGINATION
router.get(
  "/projects/:projectId/sprints/:sprintId/userStories/filter",
  authenticate,
  getUserStoriesByPriority
);

// UPDATE priority
router.patch(
  "/projects/:projectId/sprints/:sprintId/userStories/:userStoryId/priority",
  authenticate,
  authorize("ETUDIANT"),
  updateUserStoryPriority
);

// STATS by priority
router.get(
  "/projects/:projectId/sprints/:sprintId/userStories/stats/priority",
  authenticate,
  getUserStoriesStatsByPriority
);

module.exports = router;
