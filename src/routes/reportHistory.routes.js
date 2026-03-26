import express from "express";
import { loggedMiddleware } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import {
  listHistory,
  downloadReport,
} from "../controllers/reportHistory.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/version/projects/{projectId}/reports:
 *   get:
 *     summary: Lister l'historique des rapports d'un projet
 *     description: Récupère toutes les versions de rapports pour un projet donné. Nécessite auth. Tous les utilisateurs authentifiés peuvent consulter.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID du projet
 *         example: "674abcd123456789abcdef01"
 *     responses:
 *       200:
 *         description: Liste des rapports
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Report'
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Aucun rapport trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No reports found"
 *       500:
 *         description: Erreur serveur
 */
router.get(
  "/projects/:projectId/reports",
  loggedMiddleware,
  requireRole("etudiant", "encad_universitaire", "encad_entreprise"),
  listHistory
);

/**
 * @swagger
 * /api/version/projects/{projectId}/reports/{reportId}/download:
 *   get:
 *     summary: Télécharger un rapport PDF
 *     description: Télécharge un fichier PDF de rapport spécifique. Nécessite auth. Tous les utilisateurs authentifiés peuvent télécharger.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID du projet
 *         example: "674abcd123456789abcdef01"
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID du rapport
 *         example: "674abcd123456789abcdef02"
 *     responses:
 *       200:
 *         description: Fichier PDF téléchargé
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Rapport non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Report not found"
 *       500:
 *         description: Erreur serveur
 */
router.get(
  "/projects/:projectId/reports/:reportId/download",
  loggedMiddleware,
  requireRole("etudiant", "encad_universitaire", "encad_entreprise"),
  downloadReport
);

export { router };
