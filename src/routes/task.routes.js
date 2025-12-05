import express from "express";
const router = express.Router();
import {
  createTask,
  listTasks,
  getTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getTaskHistory,
} from "../controllers/task.controller.js";
import { loggedMiddleware as authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import { validate } from "../middleware/validate.js";

// Import des schémas de validation
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdParamSchema,
  listTasksQuerySchema,
} from "../validators/task.validator.js";
import { updateTaskStatusSchema } from "../validators/taskStatus.validator.js";

// CREATE Task (avec validation)
router.post(
  "/projects/:projectId/sprints/:sprintId/userStories/:userStoryId/tasks",
  authenticate,
  requireRole("etudiant"),
  validate(createTaskSchema), // ← Validation Zod
  createTask
);

// LIST Tasks by project (avec validation)
router.get(
  "/projects/:projectId/tasks",
  authenticate,
  validate(listTasksQuerySchema), // ← Validation Zod
  listTasks
);

// GET Task by ID (avec validation)
router.get(
  "/projects/:projectId/tasks/:taskId",
  authenticate,
  validate(taskIdParamSchema), // ← Validation Zod
  getTask
);

// UPDATE Task (avec validation)
router.put(
  "/tasks/:taskId",
  authenticate,
  requireRole("etudiant"),

  validate(updateTaskSchema), // ← Validation Zod
  updateTask
);

// DELETE Task (avec validation)
router.delete(
  "/tasks/:taskId",
  authenticate,
  requireRole("etudiant"),

  validate(taskIdParamSchema), // ← Validation Zod
  deleteTask
);

// UPDATE Task Status (avec validation)
router.patch(
  "/tasks/:taskId/status",
  authenticate,
  requireRole("etudiant"),

  validate(updateTaskStatusSchema), // ← Validation Zod
  updateTaskStatus
);

// GET Task History (avec validation)
router.get(
  "/tasks/:taskId/history",
  authenticate,
  validate(taskIdParamSchema), // ← Validation Zod
  getTaskHistory
);

export { router };
