import express from "express";
import { generateProjectReport } from "../controllers/projectReport.controller.js";
import {
  loggedMiddleware as authenticate,
} from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/projects/{projectId}/report:
 *   get:
 *     summary: Générer un rapport global de projet
 *     description: Génère un rapport HTML global pour un projet avec statistiques complètes (toutes les tâches, progression globale, tâches bloquées). Nécessite auth. Tous les utilisateurs authentifiés peuvent consulter.
 *     tags: [Project Reports]
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
 *     responses:
 *       200:
 *         description: Rapport HTML global généré avec succès
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: |
 *                 <!DOCTYPE html>
 *                 <html lang="fr">
 *                   <head>
 *                     <title>Rapport Global Projet PFE</title>
 *                   </head>
 *                   <body>
 *                     <h1>📊 Rapport Global - Projet PFE</h1>
 *                     <div class="stats">
 *                       <div>Total: 50 tâches</div>
 *                       <div>Terminées: 35 (70%)</div>
 *                       <div>Bloquées: 2</div>
 *                     </div>
 *                     <div class="progress-bar">70%</div>
 *                     <table>
 *                       <tr><th>Tâche</th><th>Statut</th><th>Priorité</th></tr>
 *                       <!-- ... -->
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
 *         description: Projet non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Project not found"
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
  "/projects/:projectId/report",
  authenticate,  
  generateProjectReport
);

export { router };