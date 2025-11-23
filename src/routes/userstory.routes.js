const express = require("express");
const router = express.Router();
const {
  createUserStory,
  updateUserStory,
  deleteUserStory,
  getUserStory,
  listUserStories,
} = require("../controllers/userstory.controller");

// CREATE User Story
router.post(
  "/projects/:projectId/sprints/:sprintId/userStories",
  createUserStory
);
// VIEW all user stories
router.post(
  "/projects/:projectId/sprints/:sprintId/userStories",
  listUserStories
);

// VIEW user story by id
router.get(
  "/projects/:projectId/sprints/:sprintId/userStories/:userStoryId",
  getUserStory
);

// UPDATE user story by id
router.put(
  "/projects/:projectId/sprints/:sprintId/userStories/:userStoryId",
  updateUserStory
);
// DELETE user story by id
router.delete(
  "/projects/:projectId/sprints/:sprintId/userStories/:userStoryId",
  deleteUserStory
);

module.exports = router;
