import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();

import { router as userRouter } from "./routes/user.routes.js";
import { router as projectReportRouter } from "./routes/projectReport.routes.js";
import { router as reportRouter } from "./routes/report.routes.js";
import { router as reportHistoryRouter } from "./routes/reportHistory.routes.js";
import { router as sprintReportRouter } from "./routes/sprintReport.routes.js";
import { router as taskRouter } from "./routes/task.routes.js";
import { router as userStoryRouter } from "./routes/userstory.routes.js";
import { router as validationRouter } from "./routes/validation.routes.js";

import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js'; 

const app = express();

// Connexion à la base de données
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", userRouter);
app.use("/api/project-reports", projectReportRouter);
app.use("/api/reports", reportRouter);
app.use("/api/report-histories", reportHistoryRouter);
app.use("/api/sprint-reports", sprintReportRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/user-stories", userStoryRouter);
app.use("/api/validations", validationRouter);

// Route de test
app.get("/api/health", (req, res) => {
  res.json({ message: "API is running" });
});

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Gestionnaire d'erreurs global
app.use(errorHandler);

export default app;
