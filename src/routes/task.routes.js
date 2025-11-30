const express = require("express");
const router = express.Router();
const {
  createTask,
  listTasks,
  getTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getTaskHistory
} = require("../controllers/task.controller");
const { authenticate, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");

// Import des schémas de validation
const {
  createTaskSchema,
  updateTaskSchema,
  taskIdParamSchema,
  listTasksQuerySchema
} = require("../validators/task.validator");
const { updateTaskStatusSchema } = require("../validators/taskStatus.validator");

// CREATE Task (avec validation)
router.post(
  "/projects/:projectId/sprints/:sprintId/userStories/:userStoryId/tasks",
  authenticate,
  authorize("ETUDIANT"),
  validate(createTaskSchema),  // ← Validation Zod
  createTask
);

// LIST Tasks by project (avec validation)
router.get(
  "/projects/:projectId/tasks",
  authenticate,
  validate(listTasksQuerySchema),  // ← Validation Zod
  listTasks
);

// GET Task by ID (avec validation)
router.get(
  "/projects/:projectId/tasks/:taskId",
  authenticate,
  validate(taskIdParamSchema),  // ← Validation Zod
  getTask
);

// UPDATE Task (avec validation)
router.put(
  "/tasks/:taskId",
  authenticate,
  authorize("ETUDIANT"),
  validate(updateTaskSchema),  // ← Validation Zod
  updateTask
);

// DELETE Task (avec validation)
router.delete(
  "/tasks/:taskId",
  authenticate,
  authorize("ETUDIANT"),
  validate(taskIdParamSchema),  // ← Validation Zod
  deleteTask
);

// UPDATE Task Status (avec validation)
router.patch(
  "/tasks/:taskId/status",
  authenticate,
  authorize("ETUDIANT"),
  validate(updateTaskStatusSchema),  // ← Validation Zod
  updateTaskStatus
);

// GET Task History (avec validation)
router.get(
  "/tasks/:taskId/history",
  authenticate,
  validate(taskIdParamSchema),  // ← Validation Zod
  getTaskHistory
);

module.exports = router;