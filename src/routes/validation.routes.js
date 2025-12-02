import express from "express";
import {
  validateTask,
  getTaskValidations,
} from "../controllers/validation.controller.js";
import {
  loggedMiddleware as authenticate,
  isStudent as authorize,
} from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { validateTaskSchema } from "../validators/validation.validator.js";
import { taskIdParamSchema } from "../validators/task.validator.js";

const router = express.Router();

// Valider une tâche (avec validation Zod)
router.post(
  "/tasks/:taskId/validate",
  authenticate,
  authorize,
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
