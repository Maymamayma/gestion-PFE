const express = require("express");
const router = express.Router();
const {
  createTask,
  listTasks,
  getTask
} = require("../controllers/task.controller");

// CREATE Task
router.post(
  "/projects/:projectId/sprints/:sprintId/userStories/:userStoryId/tasks",
  createTask
);

// LIST Tasks by project
router.get("/projects/:projectId/tasks", listTasks);

// GET Task by ID
router.get("/projects/:projectId/tasks/:taskId", getTask);

module.exports = router;