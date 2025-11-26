const TaskService = require("../services/task.service");
const UserStory = require("../models/UserStory.model");

module.exports = {
  createTask: async (req, res) => {
    try {
      const { projectId, sprintId, userStoryId } = req.params;
      const { title, description, priority } = req.body;

      // Vérifier que la UserStory existe
      const userStory = await UserStory.findOne({
        _id: userStoryId,
        sprintId: sprintId,
        projectId: projectId
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
        createdBy: req.user?.id || "temporary_user_id" // À remplacer par l'authentification
      });

      res.status(201).json({
        message: "Task created successfully",
        task: newTask
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  listTasks: async (req, res) => {
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
  },

  getTask: async (req, res) => {
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
  }
};