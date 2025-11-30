const express = require("express");
const router = express.Router();
const {
  validateTask,
  getTaskValidations
} = require("../controllers/validation.controller");
const { authenticate, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");

// Import du schéma de validation
const { validateTaskSchema } = require("../validators/validation.validator");
const { taskIdParamSchema } = require("../validators/task.validator");

// Valider une tâche (avec validation Zod)
router.post(
  "/tasks/:taskId/validate",
  authenticate,
  authorize(["ENCADRANT_ENTREPRISE", "ENCADRANT_UNIVERSITAIRE"]),
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

module.exports = router;