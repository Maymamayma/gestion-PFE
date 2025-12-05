import * as ValidationService from "../services/validation.service.js";
import { Task } from "../models/task.model.js";
import { Reunion } from "../models/meeting.model.js";

export const validateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { estValide, commentaire, reunionId } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: "Tâche non trouvée" });

    // Verify meeting exists if provided
    if (reunionId) {
      const reunion = await Reunion.findById(reunionId);
      if (!reunion) {
        return res.status(404).json({ error: "Réunion non trouvée" });
      }
    }

    const validation = await ValidationService.create({
      taskId,
      estValide,
      commentaire: commentaire || "",
      reunionId: reunionId || null,
      typeValidation: "Tache",
      validatedBy: req.auth?.id,
    });

    res.json({
      message: "Tâche validée avec succès",
      validation,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTaskValidations = async (req, res) => {
  try {
    const { taskId } = req.params;
    const validations = await ValidationService.listByTask(taskId);
    res.json({
      count: validations.length,
      validations,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReunionValidations = async (req, res) => {
  try {
    const { reunionId } = req.params;
    const validations = await ValidationService.listByReunion(reunionId);
    res.json({
      count: validations.length,
      validations,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


