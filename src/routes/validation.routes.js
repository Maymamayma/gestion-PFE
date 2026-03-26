import express from "express";
import {
  getReunionValidations,
  getTaskValidations,
  validateTask,
} from "../controllers/validation.controller.js";
import { loggedMiddleware as authenticate } from "../middleware/auth.js";

import { requireRole } from "../middleware/roles.js";
import { validate } from "../middleware/validate.js";
import { taskIdParamSchema } from "../validators/task.validator.js";
import { reunionIdParamSchema, validateTaskSchema } from "../validators/validation.validator.js";
const router = express.Router();


// Valider une tâche - ENCADRANTS SEULEMENT
/**
 * @swagger
 * /api/validations/tasks/{taskId}/validate:
 *   post:
 *     summary: Valider une tâche
 *     description: Valide une tâche spécifique (isValid true/false + commentaire optionnel + réunion optionnelle). Nécessite auth (ENCADRANT entreprise OU universitaire).
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
 *               meetingId:
 *                 type: string
 *                 example: "64f...xyz"
 *                 description: ID de la réunion (optionnel, null = hors réunion)
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
  requireRole("encad_entreprise", "encad_universitaire"),
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

// Récupérer validations d'une réunion - TOUS (authentifiés)
/**
 * @swagger
 * /api/validations/meetings/{meetingId}/validations:
 *   get:
 *     summary: Lister les validations d'une réunion
 *     description: Récupère toutes les validations liées à une réunion spécifique.
 *     tags: [Validations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: meetingId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la réunion
 *     responses:
 *       200:
 *         description: Liste des validations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                 validations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Validation'
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get(
  "/meetings/:meetingId/validations",
  authenticate,
  validate(reunionIdParamSchema),
  getReunionValidations
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
 *         meetingId:
 *           type: string
 *           example: "64f...ghi"
 *           description: "ID de la réunion (null si hors réunion)"
 *         typeValidation:
 *           type: string
 *           enum: ["Tache"]
 *           example: "Tache"
 */

export { router };

