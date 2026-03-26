import express from "express";
import { loggedMiddleware } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import {
  createUserStory,
  updateUserStory,
  deleteUserStory,
  getUserStory,
  listUserStories,
} from "../controllers/userstory.controller.js";
import { validateRequest } from "../middleware/validate.js";
import {
  createUserStorySchema,
  updateUserStorySchema,
  userStoryParamsSchema, // The generic schema for params validation
  validateUserStoryDatesWithSprint,
} from "../validators/userStory.validator.js";
import { validate } from "uuid";

const router = express.Router();

// CREATE User Story
router.post(
  "/projects/:projectId/sprints/:sprintId/userStories",
  validateRequest(createUserStorySchema), // Validates body and params
  validateUserStoryDatesWithSprint,
  loggedMiddleware,
  requireRole("etudiant"),
  createUserStory
);

// LIST all user stories for a sprint
router.get(
  "/projects/:projectId/sprints/:sprintId/userStories",
  validateRequest(userStoryParamsSchema), // Validates projectId and sprintId
  loggedMiddleware,
  requireRole("etudiant"),
  listUserStories
);

// GET a single user story by id
router.get(
  "/projects/:projectId/sprints/:sprintId/userStories/:userStoryId",
  validateRequest(userStoryParamsSchema), // Validates all three IDs
  loggedMiddleware,
  requireRole("etudiant"),
  getUserStory
);

// UPDATE a user story by id
router.put(
  "/projects/:projectId/sprints/:sprintId/userStories/:userStoryId",
  validateRequest(updateUserStorySchema), // Validates optional body and all three IDs
  loggedMiddleware,
  requireRole("etudiant"),
  updateUserStory
);

// DELETE a user story by id
router.delete(
  "/projects/:projectId/sprints/:sprintId/userStories/:userStoryId",
  validateRequest(userStoryParamsSchema), // Validates all three IDs
  loggedMiddleware,
  requireRole("etudiant"),
  deleteUserStory
);

export { router };
