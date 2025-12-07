import { TaskService } from "../services/task.service.js";
import { TaskHistory } from "../models/TaskHistory.model.js";
import { Sprint } from "../models/sprint.model.js";
import { generateSprintReportHTML } from "../utils/htmlReportSprint.js";

export const generateSprintReport = async (req, res) => {
  try {
    const { projectId, sprintId } = req.params;

    // Récupérer le sprint depuis la base de données
    const sprint = await Sprint.findById(sprintId);
    if (!sprint) {
      return res.status(404).json({ error: "Sprint not found" });
    }

    // Récupérer les tâches du sprint
    const tasks = await TaskService.list(projectId, { sprintId });

    // Récupérer l'historique
    const taskIds = tasks.map((t) => t._id);
    const history = await TaskHistory.find({ taskId: { $in: taskIds } })
      .sort({ changedAt: -1 })
      .populate("taskId", "title")
      .populate("changedBy", "user_name email");

    // Générer le HTML
    const html = generateSprintReportHTML(sprint, tasks, history);

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
