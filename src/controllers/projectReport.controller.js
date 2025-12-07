import { TaskService } from "../services/task.service.js";
import { TaskHistory } from "../models/TaskHistory.model.js";
import { generateProjectReportHTML } from "../utils/htmlReportProject.js";
import { Project } from "../models/project.model.js";

export const generateProjectReport = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Récupérer toutes les tâches du projet
    const allTasks = await TaskService.list(projectId, {});

    // Récupérer tout l'historique
    const taskIds = allTasks.map((t) => t._id);
    const allHistory = await TaskHistory.find({ taskId: { $in: taskIds } })
      .sort({ changedAt: -1 })
      .populate("taskId", "title")
      .populate("changedBy", "user_name email");

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Sprints (vide pour l'instant, à adapter si vous avez le modèle Sprint)
    const sprints = [];

    // Générer le HTML
    const html = generateProjectReportHTML(
      project,
      sprints,
      allTasks,
      allHistory
    );

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
