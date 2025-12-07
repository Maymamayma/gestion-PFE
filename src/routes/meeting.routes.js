import express from "express";
import {
  cancelMeeting,
  completeMeeting,
  createMeeting,
  deleteMeeting,
  getAllMeetings,
  getCancelledMeetings,
  getCompletedMeetings,
  getMeetingById,
  getUpcomingMeetings,
  updateMeeting,
  validateMeetingContent,
} from "../controllers/meeting.controller.js";
import { loggedMiddleware as authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import { validate } from "../middleware/validate.js";
import {
  completeMeetingSchema,
  createMeetingSchema,
  meetingIdParamSchema,
  projectIdQuerySchema,
  updateMeetingSchema,
  validateMeetingContentSchema,
} from "../validators/meeting.validator.js";

const router = express.Router();

// Create meeting (Student only)
/**
 * @swagger
 * /api/meetings:
 *   post:
 *     summary: Créer une réunion
 *     description: Permet à un étudiant de planifier une nouvelle réunion avec ordre du jour. Peut référencer une User Story, Task ou Report.
 *     tags: [Meetings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectId:
 *                 type: string
 *                 example: "64f...abc"
 *               datePlanification:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-10T14:00:00.000Z"
 *               ordreDuJour:
 *                 type: string
 *                 example: "Discussion sur l'avancement du sprint 1"
 *               referenceType:
 *                 type: string
 *                 enum: [UserStory, Task, Report]
 *                 example: "Task"
 *               referenceId:
 *                 type: string
 *                 example: "64f...def"
 *             required: [projectId, datePlanification, ordreDuJour]
 *     responses:
 *       201:
 *         description: Réunion créée avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Projet ou référence non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post(
  "/",
  authenticate,
  requireRole("etudiant"),
  validate(createMeetingSchema),
  createMeeting
);

// Get all meetings (with optional project filter)
/**
 * @swagger
 * /api/meetings:
 *   get:
 *     summary: Récupérer toutes les réunions
 *     description: Liste toutes les réunions avec filtre optionnel par projet
 *     tags: [Meetings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *         description: ID du projet (optionnel)
 *     responses:
 *       200:
 *         description: Liste des réunions
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get(
  "/",
  authenticate,
  validate(projectIdQuerySchema),
  getAllMeetings
);

// Get upcoming meetings
/**
 * @swagger
 * /api/meetings/upcoming:
 *   get:
 *     summary: Récupérer les réunions à venir
 *     description: Liste les réunions planifiées dans le futur
 *     tags: [Meetings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *         description: ID du projet (optionnel)
 *     responses:
 *       200:
 *         description: Liste des réunions à venir
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get(
  "/upcoming",
  authenticate,
  validate(projectIdQuerySchema),
  getUpcomingMeetings
);

// Get completed meetings
/**
 * @swagger
 * /api/meetings/completed:
 *   get:
 *     summary: Récupérer les réunions effectuées
 *     description: Liste les réunions avec statut "Effectuee"
 *     tags: [Meetings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *         description: ID du projet (optionnel)
 *     responses:
 *       200:
 *         description: Liste des réunions effectuées
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get(
  "/completed",
  authenticate,
  validate(projectIdQuerySchema),
  getCompletedMeetings
);

// Get cancelled meetings
/**
 * @swagger
 * /api/meetings/cancelled:
 *   get:
 *     summary: Récupérer les réunions annulées
 *     description: Liste les réunions avec statut "Annulee"
 *     tags: [Meetings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *         description: ID du projet (optionnel)
 *     responses:
 *       200:
 *         description: Liste des réunions annulées
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get(
  "/cancelled",
  authenticate,
  validate(projectIdQuerySchema),
  getCancelledMeetings
);

// Get meeting by ID
/**
 * @swagger
 * /api/meetings/{id}:
 *   get:
 *     summary: Récupérer une réunion par ID
 *     description: Détails d'une réunion spécifique
 *     tags: [Meetings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la réunion
 *     responses:
 *       200:
 *         description: Détails de la réunion
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Réunion non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get(
  "/:id",
  authenticate,
  validate(meetingIdParamSchema),
  getMeetingById
);

// Update meeting (Student only, before completion)
/**
 * @swagger
 * /api/meetings/{id}:
 *   put:
 *     summary: Modifier une réunion
 *     description: Permet à un étudiant de modifier une réunion non effectuée
 *     tags: [Meetings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la réunion
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               datePlanification:
 *                 type: string
 *                 format: date-time
 *               ordreDuJour:
 *                 type: string
 *               referenceType:
 *                 type: string
 *                 enum: [UserStory, Task, Report]
 *               referenceId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Réunion modifiée avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Réunion non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.put(
  "/:id",
  authenticate,
  requireRole("etudiant"),
  validate(updateMeetingSchema),
  updateMeeting
);

// Complete meeting with report (Student only)
/**
 * @swagger
 * /api/meetings/{id}/complete:
 *   post:
 *     summary: Compléter une réunion avec compte rendu
 *     description: Permet à un étudiant d'ajouter le compte rendu après la réunion
 *     tags: [Meetings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la réunion
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               compteRendu:
 *                 type: string
 *                 example: "Réunion tenue le 10/12. Nous avons discuté..."
 *             required: [compteRendu]
 *     responses:
 *       200:
 *         description: Réunion complétée avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Réunion non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.post(
  "/:id/complete",
  authenticate,
  requireRole("etudiant"),
  validate(completeMeetingSchema),
  completeMeeting
);

// Cancel meeting (Student only)
/**
 * @swagger
 * /api/meetings/{id}/cancel:
 *   post:
 *     summary: Annuler une réunion
 *     description: Permet à un étudiant d'annuler une réunion planifiée
 *     tags: [Meetings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la réunion
 *     responses:
 *       200:
 *         description: Réunion annulée avec succès
 *       400:
 *         description: Impossible d'annuler une réunion effectuée
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Réunion non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.post(
  "/:id/cancel",
  authenticate,
  requireRole("etudiant"),
  validate(meetingIdParamSchema),
  cancelMeeting
);

// Validate meeting content (University supervisor only)
/**
 * @swagger
 * /api/meetings/{id}/validate:
 *   post:
 *     summary: Valider le contenu d'une réunion
 *     description: Permet à un encadrant universitaire de valider le compte rendu d'une réunion
 *     tags: [Meetings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la réunion
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estValide:
 *                 type: boolean
 *                 example: true
 *               commentaire:
 *                 type: string
 *                 example: "Bon compte rendu"
 *             required: [estValide]
 *     responses:
 *       200:
 *         description: Contenu validé avec succès
 *       400:
 *         description: Impossible de valider une réunion non effectuée
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé (pas encadrant universitaire)
 *       404:
 *         description: Réunion non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.post(
  "/:id/validate",
  authenticate,
  requireRole("encad_universitaire"),
  validate(validateMeetingContentSchema),
  validateMeetingContent
);

// Delete meeting (Student only)
/**
 * @swagger
 * /api/meetings/{id}:
 *   delete:
 *     summary: Supprimer une réunion
 *     description: Permet à un étudiant de supprimer une réunion.
 *     tags: [Meetings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la réunion
 *     responses:
 *       200:
 *         description: Réunion supprimée
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Réunion non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete(
  "/:id",
  authenticate,
  requireRole("etudiant"),
  validate(meetingIdParamSchema),
  deleteMeeting
);

/**
 * @swagger
 * components:
 *   schemas:
 *     Meeting:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f...abc"
 *         projectId:
 *           type: string
 *           example: "64f...def"
 *         plannedDate:
 *           type: string
 *           format: date-time
 *           example: "2025-12-10T14:00:00Z"
 *         agenda:
 *           type: string
 *           example: "Discussion sur l'avancement du sprint 1"
 *         actualReport:
 *           type: string
 *           example: "Réunion tenue le 10/12..."
 *         isCompleted:
 *           type: boolean
 *           example: true
 *         referenceType:
 *           type: string
 *           enum: [UserStory, Task, Report, null]
 *           example: "UserStory"
 *         referenceId:
 *           type: string
 *           example: "64f...ghi"
 *         isValidated:
 *           type: boolean
 *           example: true
 *         validatedBy:
 *           type: string
 *           example: "64f...jkl"
 *         validatedAt:
 *           type: string
 *           format: date-time
 *         validationComment:
 *           type: string
 *         createdBy:
 *           type: string
 *           example: "64f...mno"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

export { router };

