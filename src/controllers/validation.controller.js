const ValidationService = require("../services/validation.service");
const Task = require("../models/Task.model");
const Reunion = require("../models/Reunion.model");

module.exports = {
  validateTask: async (req, res) => {
    try {
      const { taskId } = req.params;
      const { isValid, comment } = req.body;

      const task = await Task.findById(taskId);
      if (!task) return res.status(404).json({ error: "Task not found" });

      const validation = await ValidationService.create({
        taskId,
        isValid,
        comment,
        typeValidation: "Tache",
        validatedBy: req.user?.id || "temporary_user_id",
      });

      res.json({
        message: "Task validated",
        validation,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getTaskValidations: async (req, res) => {
    try {
      const { taskId } = req.params;
      const validations = await ValidationService.listByTask(taskId);
      res.json(validations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
