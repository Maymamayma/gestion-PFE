import express from "express";
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { globSync } from 'glob';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { router as projectReportRouter } from "./routes/projectReport.routes.js";
import { router as reportRouter } from "./routes/report.routes.js";
import { router as reportHistoryRouter } from "./routes/reportHistory.routes.js";
import { router as sprintReportRouter } from "./routes/sprintReport.routes.js";
import { router as taskRouter } from "./routes/task.routes.js";
import { router as userStoryRouter } from "./routes/userstory.routes.js";
import { router as validationRouter } from "./routes/validation.routes.js";
import projectRoutes from "./routes/project.routes.js";
import sprinRoutes from "./routes/sprint.routes.js";

import authRoutes from "./routes/auth.routes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/project-reports", projectReportRouter);
app.use("/api/reports", reportRouter);
app.use("/api/report-histories", reportHistoryRouter);
app.use("/api/sprint-reports", sprintReportRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/user-stories", userStoryRouter);
app.use("/api/validations", validationRouter);
app.use("/api/sprints", sprinRoutes);

//el auth
app.use("/api/auth", authRoutes);

//routes project (abir touch it and i ll kill u )
app.use("/api/projects", projectRoutes);

// Fix ESM : Obtenir __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Glob les fichiers routes
const apiFiles = globSync('./routes/*.routes.js', { cwd: __dirname });

// Configuration Swagger
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Gestion de Projets",
      version: "1.0.0",
      description: "Documentation automatique de l'API backend Node.js avec Swagger.",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Serveur de développement",
      },
    ],
  },
  apis: apiFiles.map(file => join(__dirname, file)), // Chemins absolus pour un parsing fiable
};

const specs = swaggerJsdoc(options);

// Route pour Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Redirection racine vers docs
app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

// Route 404
app.use((req, res) => {
  res.status(404).json({ message: "Route non found" });
});

// Gestionnaire d'erreurs global
app.use(errorHandler);

export default app;