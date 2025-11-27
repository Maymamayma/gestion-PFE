const express = require("express");
const router = express.Router();
const {
  createTask,
  listTasks,
  getTask,
  updateTask,     
  deleteTask     
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

// UPDATE Task (titre, description, priorité)
router.put("/tasks/:taskId", updateTask);

// DELETE Task
router.delete("/tasks/:taskId", deleteTask);

module.exports = router;