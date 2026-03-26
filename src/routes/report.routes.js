import express from "express";
import upload from "../middleware/uploadReport.js";
import {
  listReportsByProject,
  uploadReportVersion,
} from "../controllers/report.controller.js";
import { loggedMiddleware as authenticate } from "../middleware/auth.js";

import { requireRole } from "../middleware/roles.js";
const router = express.Router();

/**
 * @swagger
 * /api/version/projects/{projectId}/reports/upload:
 *   post:
 *     summary: Uploader une nouvelle version de rapport PDF
 *     description: Upload un fichier PDF de rapport pour un projet. Nécessite auth (étudiant seulement).
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
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               pdf:
 *                 type: string
 *                 format: binary
 *                 description: Fichier PDF du rapport
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date du rapport
 *                 example: "2025-12-04"
 *             required: [pdf, date]
 *     responses:
 *       201:
 *         description: Rapport uploadé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Report version uploaded successfully"
 *                 report:
 *                   $ref: '#/components/schemas/Report'
 *       400:
 *         description: Fichier invalide ou données manquantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "PDF file is required"
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé (pas étudiant)
 *       500:
 *         description: Erreur serveur
 */
router.post(
  "/projects/:projectId/reports/upload",
  authenticate,
  requireRole("etudiant"),
  upload.single("pdf"),
  uploadReportVersion
);

router.get(
  "/projects/:projectId/reports",
  authenticate,
  requireRole("etudiant"),
  listReportsByProject
);

export { router };
