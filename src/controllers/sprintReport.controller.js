const TaskService = require("../services/task.service");
const TaskHistory = require("../models/TaskHistory.model");
const htmlReportSprint = require("../utils/htmlReportSprint");

module.exports = {
  generateSprintReport: async (req, res) => {
    try {
      const { projectId, sprintId } = req.params;

      // Récupérer les tâches du sprint
      const tasks = await TaskService.list(projectId, { sprintId });

      // Récupérer l'historique
      const taskIds = tasks.map(t => t._id);
      const history = await TaskHistory.find({ taskId: { $in: taskIds } })
        .sort({ changedAt: -1 })
        .populate("taskId", "title")
        .populate("changedBy", "user_name email");

      // Sprint minimal (à adapter si vous avez le modèle Sprint)
      const sprint = {
        _id: sprintId,
        numero: sprintId,
        nom: "Sprint",
        dateDebut: new Date(),
        dateFin: new Date()
      };

      // Générer le HTML
      const html = htmlReportSprint.generateSprintReportHTML(sprint, tasks, history);

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.send(html);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};