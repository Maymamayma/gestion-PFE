// src/routes/userstory.routes.js
const express = require("express");
const router = express.Router();

const {
  createUserStory,
  getUserStoriesBySprintId,
  getUserStoryById,
  updateUserStory,
  deleteUserStory,
} = require("../controllers/userstory.controller");

const { authenticate, authorize } = require("../middleware/auth");

// CREATE User Story
router.post(
  "/projects/:projectId/sprints/:sprintId/userStories",
  authenticate,
  authorize("ETUDIANT"),
  createUserStory
);

// GET All User Stories by Sprint
router.get(
  "/projects/:projectId/sprints/:sprintId/userStories",
  authenticate,
  getUserStoriesBySprintId
);

// GET One User Story
router.get(
  "/projects/:projectId/sprints/:sprintId/userStories/:userStoryId",
  authenticate,
  getUserStoryById
);

// UPDATE User Story
router.put(
  "/projects/:projectId/sprints/:sprintId/userStories/:userStoryId",
  authenticate,
  authorize("ETUDIANT"),
  updateUserStory
);

// DELETE User Story
router.delete(
  "/projects/:projectId/sprints/:sprintId/userStories/:userStoryId",
  authenticate,
  authorize("ETUDIANT"),
  deleteUserStory
);

module.exports = router;
