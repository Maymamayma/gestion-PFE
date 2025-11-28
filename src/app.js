const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userStoriesRoutes = require("./routes/userstory.routes");
const taskRoutes = require("./routes/task.routes");
const validationRoutes = require("./routes/validation.routes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

app.use("/", userStoriesRoutes);
app.use("/", taskRoutes);
app.use("/", validationRoutes);

// Route de test
app.get("/api/health", (req, res) => {
  res.json({ message: "API is running" });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ message: "Route non trouvée" });
});

module.exports = app;
