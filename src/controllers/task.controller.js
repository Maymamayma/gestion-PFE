import { TaskService } from "../services/task.service.js";
import { UserStory } from "../models/UserStory.model.js";
import { TaskHistory } from "../models/TaskHistory.model.js";
export const createTask = async (req, res) => {
  try {
    const { projectId, sprintId, userStoryId } = req.params;
    const { title, description, priority } = req.body;

    // Vérifier que la UserStory existe
    const userStory = await UserStory.findOne({
      _id: userStoryId,
      sprintId: sprintId,
      projectId: projectId,
    });

    if (!userStory) {
      return res.status(404).json({ error: "User Story not found" });
    }

    // Créer la tâche
    const newTask = await TaskService.create({
      title,
      description,
      priority,
      userStoryId,
      sprintId,
      projectId,
      createdBy: req.user?._id || "temporary_user_id",
    });

    res.status(201).json({
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const listTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { sprintId, status } = req.query;

    const filters = {};
    if (sprintId) filters.sprintId = sprintId;
    if (status) filters.status = status;

    const tasks = await TaskService.list(projectId, filters);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await TaskService.getById(taskId);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, priority } = req.body;

    // Vérifier que la tâche existe
    const task = await TaskService.getById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Mettre à jour
    const updatedTask = await TaskService.update(taskId, {
      title,
      description,
      priority,
    });

    res.json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Vérifier que la tâche existe
    const task = await TaskService.getById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Supprimer
    await TaskService.delete(taskId);

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status, notes } = req.body;

    // Vérifier que la tâche existe
    const task = await TaskService.getById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const oldStatus = task.status;

    // Si le statut n'a pas changé
    if (oldStatus === status) {
      return res.status(200).json({
        message: "Status unchanged",
        task,
      });
    }

    // Mettre à jour le statut
    const updatedTask = await TaskService.update(taskId, { status });

    // Créer l'historique
    await TaskHistory.create({
      taskId,
      oldStatus,
      newStatus: status,
      changedBy: req.user?._id || "temporary_user_id",
      notes,
    });

    res.json({
      message: "Task status updated and history logged",
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getTaskHistory = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Vérifier que la tâche existe
    const task = await TaskService.getById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Récupérer l'historique

    const history = await TaskHistory.find({ taskId })
      .sort({ changedAt: -1 })
      .populate("changedBy", "user_name email");

    res.json({
      message: "Task history retrieved successfully",
      history,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
