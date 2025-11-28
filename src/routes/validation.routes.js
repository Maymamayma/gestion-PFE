const express = require("express");
const router = express.Router();
const {
  validateTask,
  getTaskValidations,
} = require("../controllers/validation.controller");

// Valider une tâche
router.post("/tasks/:taskId/validate", validateTask);

// Récupérer validations d’une tâche
router.get("/tasks/:taskId/validations", getTaskValidations);

module.exports = router;
