// src/routes/userstoryPriority.routes.js
const express = require("express");
const router = express.Router();

const {
  prioritizeUserStory,
  getPrioritizedUserStories,
} = require("../controllers/userstoryPriority.controller");

// VIEW user stories by priority
router.route("/prioritized").get(getPrioritizedUserStories);

// UPDATE priority
router.route("/:userStoryId/prioritize").patch(prioritizeUserStory);
module.exports = router;
