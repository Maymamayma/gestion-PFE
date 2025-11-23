const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const reportHistory = require("./src/routes/reportHistory.routes");
const reportVersion = require("./src/routes/report.routes");
const UserStoryPriority = require("./src/routes/userstoryPriority.routes");
const UserStory = require("./src/routes/userstory.routes");

const connectDB = require("./src/config/db");

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/version", reportHistory);
app.use("/api/version", reportVersion);
app.use("/api/version", UserStoryPriority);
app.use("/api/version", UserStory);
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
