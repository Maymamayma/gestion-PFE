import express from "express";
import {
  validateTask,
  getTaskValidations,
} from "../controllers/validation.controller.js";
import { loggedMiddleware as authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { validateTaskSchema } from "../validators/validation.validator.js";
import { taskIdParamSchema } from "../validators/task.validator.js";
import { requireRole } from "../middleware/roles.js";
const router = express.Router();

// Valider une tâche (avec validation Zod)
router.post(
  "/tasks/:taskId/validate",
  authenticate,
  requireRole("etudiant"),

  validate(validateTaskSchema),
  validateTask
);

// Récupérer validations d'une tâche (avec validation Zod)
router.get(
  "/tasks/:taskId/validations",
  authenticate,
  validate(taskIdParamSchema),
  getTaskValidations
);

export { router };
