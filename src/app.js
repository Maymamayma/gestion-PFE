const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const userStoriesRoutes = require("./routes/userStories");
const rapportsRoutes = require("./routes/rapports");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/version", userStoriesRoutes);
app.use("/api/version", rapportsRoutes);

// Route de test
app.get("/api/health", (req, res) => {
  res.json({ message: "API is running" });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ message: "Route non trouvée" });
});

module.exports = app;
