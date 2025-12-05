import express from "express";
import { generateSprintReport } from "../controllers/sprintReport.controller.js";
import {
  loggedMiddleware as authenticate,
} from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/projects/{projectId}/sprints/{sprintId}/report:
 *   get:
 *     summary: Générer un rapport de sprint
 *     description: Génère un rapport HTML pour un sprint spécifique dans un projet. Nécessite auth. Tous les utilisateurs authentifiés peuvent consulter les rapports.
 *     tags: [Sprint Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID du projet (format MongoDB ObjectId)
 *         example: "674abcd123456789abcdef01"
 *       - in: path
 *         name: sprintId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID du sprint (format MongoDB ObjectId)
 *         example: "674abcd123456789abcdef02"
 *     responses:
 *       200:
 *         description: Rapport HTML généré avec succès
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: |
 *                 <!DOCTYPE html>
 *                 <html lang="fr">
 *                   <head>
 *                     <title>Rapport Sprint 1</title>
 *                   </head>
 *                   <body>
 *                     <h1>📊 Rapport Sprint 1</h1>
 *                     <div class="progress-bar">75%</div>
 *                     <table>
 *                       <tr><th>Tâche</th><th>Statut</th></tr>
 *                       <tr><td>Implémenter login</td><td>Done</td></tr>
 *                     </table>
 *                   </body>
 *                 </html>
 *       401:
 *         description: Non authentifié - Token JWT manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token missing"
 *       404:
 *         description: Projet ou sprint non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Sprint not found"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get(
  "/projects/:projectId/sprints/:sprintId/report",
  authenticate,  // Tous les utilisateurs authentifiés peuvent consulter
  generateSprintReport
);

/**
 * @swagger
 * components:
 *   schemas:
 *     Report:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "674abcd123456789abcdef01"
 *         projectId:
 *           type: string
 *           example: "674abcd123456789abcdef02"
 *         date:
 *           type: string
 *           format: date-time
 *           example: "2025-12-04T10:00:00Z"
 *         fileName:
 *           type: string
 *           example: "rapport-sprint-1.html"
 *         filePath:
 *           type: string
 *           example: "/uploads/rapports/rapport-sprint-1.html"
 *         version:
 *           type: number
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-12-04T10:00:00Z"
 */

export { router };