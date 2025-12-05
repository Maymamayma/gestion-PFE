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

import {
  createTaskSchema,
  updateTaskSchema,
  taskIdParamSchema,
  listTasksQuerySchema,
} from "../validators/task.validator.js";
import { updateTaskStatusSchema } from "../validators/taskStatus.validator.js";

// CREATE Task (avec validation)
/**
 * @swagger
 * /api/tasks/projects/{projectId}/sprints/{sprintId}/userStories/{userStoryId}/tasks:
 *   post:
 *     summary: Créer une nouvelle task
 *     description: Crée une task liée à un projet, sprint et user story. Nécessite auth (étudiant).
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet
 *       - in: path
 *         name: sprintId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du sprint
 *       - in: path
 *         name: userStoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'user story
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Implémenter login"
 *                 minLength: 3
 *                 maxLength: 255
 *               description:
 *                 type: string
 *                 example: "Développer la fonctionnalité de connexion utilisateur"
 *                 minLength: 10
 *               priority:
 *                 type: string
 *                 enum: ["Basse", "Moyenne", "Haute"]
 *                 example: "Haute"
 *             required: [title, description, priority]
 *     responses:
 *       201:
 *         description: Task créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "64f...abc"
 *                 title:
 *                   type: string
 *                   example: "Implémenter login"
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé (pas étudiant)
 *       500:
 *         description: Erreur serveur
 */
router.post(
  "/projects/:projectId/sprints/:sprintId/userStories/:userStoryId/tasks",
  authenticate,
  requireRole("etudiant"),
  validate(createTaskSchema), // ← Validation Zod

  createTask
);

// LIST Tasks by project (avec validation)
/**
 * @swagger
 * /api/tasks/projects/{projectId}/tasks:
 *   get:
 *     summary: Lister les tasks d'un projet
 *     description: Récupère la liste des tasks pour un projet donné. Nécessite auth.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: ["ToDo", "InProgress", "Standby", "Done"]
 *         description: Filtre par status (optionnel)
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: ["Basse", "Moyenne", "Haute"]
 *         description: Filtre par priorité (optionnel)
 *     responses:
 *       200:
 *         description: Liste des tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "64f...abc"
 *                   title:
 *                     type: string
 *                     example: "Implémenter login"
 *                   status:
 *                     type: string
 *                     example: "ToDo"
 *                   priority:
 *                     type: string
 *                     example: "Haute"
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get(
  "/projects/:projectId/tasks",
  authenticate,
  validate(listTasksQuerySchema),
  listTasks
);

// GET Task by ID (avec validation)
/**
 * @swagger
 * /api/tasks/projects/{projectId}/tasks/{taskId}:
 *   get:
 *     summary: Récupérer une task par ID
 *     description: Détails d'une task spécifique dans un projet. Nécessite auth.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la task
 *     responses:
 *       200:
 *         description: Détails de la task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task non trouvée
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get(
  "/projects/:projectId/tasks/:taskId",
  authenticate,
  validate(taskIdParamSchema),
  getTask
);

// UPDATE Task (avec validation)
/**
 * @swagger
 * /api/tasks/tasks/{taskId}:
 *   put:
 *     summary: Mettre à jour une task
 *     description: Met à jour les détails d'une task. Nécessite auth (étudiant).
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Implémenter login v2"
 *               description:
 *                 type: string
 *                 example: "Améliorer la connexion avec OAuth"
 *               priority:
 *                 type: string
 *                 enum: ["Basse", "Moyenne", "Haute"]
 *                 example: "Moyenne"
 *     responses:
 *       200:
 *         description: Task mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Task non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.put(
  "/tasks/:taskId",
  authenticate,
  requireRole("etudiant"),

  validate(updateTaskSchema), // ← Validation Zod

  updateTask
);

// DELETE Task (avec validation)
/**
 * @swagger
 * /api/tasks/tasks/{taskId}:
 *   delete:
 *     summary: Supprimer une task
 *     description: Supprime une task par ID. Nécessite auth (étudiant).
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la task
 *     responses:
 *       200:
 *         description: Task supprimée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Task supprimée avec succès"
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Task non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete(
  "/tasks/:taskId",
  authenticate,
  requireRole("etudiant"),

  validate(taskIdParamSchema), // ← Validation Zod

  deleteTask
);

// UPDATE Task Status (avec validation)
/**
 * @swagger
 * /api/tasks/tasks/{taskId}/status:
 *   patch:
 *     summary: Mettre à jour le status d'une task
 *     description: Change le status d'une task (ex. ToDo -> InProgress). Nécessite auth (étudiant).
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ["ToDo", "InProgress", "Standby", "Done"]
 *                 example: "InProgress"
 *             required: [status]
 *     responses:
 *       200:
 *         description: Status mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Status invalide
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Task non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.patch(
  "/tasks/:taskId/status",
  authenticate,
  requireRole("etudiant"),

  validate(updateTaskStatusSchema), // ← Validation Zod

  updateTaskStatus
);

// GET Task History (avec validation)
/**
 * @swagger
 * /api/tasks/tasks/{taskId}/history:
 *   get:
 *     summary: Récupérer l'historique d'une task
 *     description: Retourne l'historique des changements d'une task. Nécessite auth.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la task
 *     responses:
 *       200:
 *         description: Historique des changements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   changeDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-12-04T10:00:00Z"
 *                   changedBy:
 *                     type: string
 *                     example: "User ID"
 *                   changes:
 *                     type: object
 *                     example: { status: "ToDo -> InProgress" }
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Task non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get(
  "/tasks/:taskId/history",
  authenticate,
  validate(taskIdParamSchema),
  getTaskHistory
);

// Schéma global pour Task (à ajouter à la fin pour réutilisation)
/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f...abc"
 *         title:
 *           type: string
 *           example: "Implémenter login"
 *         description:
 *           type: string
 *           example: "Développer la connexion"
 *         status:
 *           type: string
 *           enum: ["ToDo", "InProgress", "Standby", "Done"]
 *           example: "ToDo"
 *         priority:
 *           type: string
 *           enum: ["Basse", "Moyenne", "Haute"]
 *           example: "Haute"
 *         userStoryId:
 *           type: string
 *           example: "64f...def"
 *         sprintId:
 *           type: string
 *           example: "64f...ghi"
 *         projectId:
 *           type: string
 *           example: "64f...jkl"
 *         createdBy:
 *           type: string
 *           example: "User ID"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-12-04T10:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-12-04T10:00:00Z"
 */

export { router };
