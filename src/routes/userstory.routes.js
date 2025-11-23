// src/routes/userstory.routes.js
const express = require("express");
const router = express.Router();
const {
  createUserStory,
  getUserStoryById,
  updateUserStory,
  deleteUserStory,
  getUserStories,
} = require("../controllers/userstory.controller");

// CREATE User Story
router.post("/", createUserStory);
// VIEW all user stories
router.post("/", getUserStories);
router
  .route("/:userStoryId")
  .get(getUserStoryById)
  .put(updateUserStory)
  .delete(deleteUserStory);

module.exports = router;
