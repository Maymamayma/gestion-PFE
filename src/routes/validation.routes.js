import express from "express";
import {
  validateTask,
  getTaskValidations,
} from "../controllers/validation.controller.js";
import {
  loggedMiddleware as authenticate,
  isCompanySupervisor,
  isUniversitySupervisor,
} from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { validateTaskSchema } from "../validators/validation.validator.js";
import { taskIdParamSchema } from "../validators/task.validator.js";

const router = express.Router();

// Middleware personnalisé : Encadrants seulement (entreprise OU universitaire)
const isSupervisor = (req, res, next) => {
  if (!req.auth) {
    return res.status(401).json({ error: "Non authentifié" });
  }

  const role = req.auth.role;
  if (role === "encad_entreprise" || role === "encad_universitaire") {
    next();
  } else {
    return res.status(403).json({ 
      error: "Accès interdit. Seuls les encadrants peuvent valider les tâches." 
    });
  }
};

// Valider une tâche - ENCADRANTS SEULEMENT
/**
 * @swagger
 * /api/validations/tasks/{taskId}/validate:
 *   post:
 *     summary: Valider une tâche
 *     description: Valide une tâche spécifique (isValid true/false + commentaire optionnel). Nécessite auth (ENCADRANT entreprise OU universitaire).
 *     tags: [Validations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tâche à valider
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isValid:
 *                 type: boolean
 *                 example: true
 *               comment:
 *                 type: string
 *                 example: "Code bien structuré, mais ajouter des tests unitaires."
 *             required: [isValid]
 *     responses:
 *       201:
 *         description: Validation créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Validation'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé (pas encadrant)
 *       404:
 *         description: Tâche non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.post(
  "/tasks/:taskId/validate",
  authenticate,
  isSupervisor,
  validate(validateTaskSchema),
  validateTask
);

// Récupérer validations d'une tâche - TOUS (authentifiés)
/**
 * @swagger
 * /api/validations/tasks/{taskId}/validations:
 *   get:
 *     summary: Lister les validations d'une tâche
 *     description: Récupère toutes les validations pour une tâche donnée. Nécessite auth.
 *     tags: [Validations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tâche
 *     responses:
 *       200:
 *         description: Liste des validations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Validation'
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Tâche non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get(
  "/tasks/:taskId/validations",
  authenticate,
  validate(taskIdParamSchema),
  getTaskValidations
);

/**
 * @swagger
 * components:
 *   schemas:
 *     Validation:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f...abc"
 *         taskId:
 *           type: string
 *           example: "64f...def"
 *         isValid:
 *           type: boolean
 *           example: true
 *         comment:
 *           type: string
 *           example: "Code bien structuré, mais ajouter des tests unitaires."
 *         validatedBy:
 *           type: string
 *           example: "User ID"
 *         validatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-12-04T10:00:00Z"
 *         typeValidation:
 *           type: string
 *           enum: ["Tache"]
 *           example: "Tache"
 */

export { router };