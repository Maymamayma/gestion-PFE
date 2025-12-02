import express from "express";
const router = express.Router();
import {
  createUserStory,
  updateUserStory,
  deleteUserStory,
  getUserStory,
  listUserStories,
} from "../controllers/userstory.controller.js";

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

export { router };
