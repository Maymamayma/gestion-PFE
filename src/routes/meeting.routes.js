import express from "express";
import {
  createMeeting,
  getAllMeetings,
  getMeetingById,
  updateMeeting,
  completeMeeting,
  cancelMeeting,
  validateMeetingContent,
  deleteMeeting,
  getUpcomingMeetings,
  getCompletedMeetings,
  getCancelledMeetings,
} from "../controllers/meeting.controller.js";
import { loggedMiddleware as authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import { validate } from "../middleware/validate.js";
import {
  createMeetingSchema,
  updateMeetingSchema,
  completeMeetingSchema,
  validateMeetingContentSchema,
  meetingIdParamSchema,
  projectIdQuerySchema,
} from "../validators/meeting.validator.js";

const router = express.Router();

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
