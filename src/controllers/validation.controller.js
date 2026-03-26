import { Reunion } from "../models/meeting.model.js";
import { Task } from "../models/task.model.js";
import * as ValidationService from "../services/validation.service.js";

export const validateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { isValid, comment, meetingId } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: "Task not found " });

    // Verify meeting exists if provided
    if (meetingId) {
      const reunion = await Reunion.findById(meetingId);
      if (!reunion) {
        return res.status(404).json({ error: "Meeting not found" });
      }
    }

    const validation = await ValidationService.create({
      taskId,
      estValide: isValid,
      commentaire: comment || "",
      reunionId: meetingId || null,
      typeValidation: "Tache",
      validatedBy: req.user?.id,
    });

    res.json({
      message: "Task validated successfully",
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
    const { meetingId } = req.params;
    const validations = await ValidationService.listByReunion(meetingId);
    res.json({
      count: validations.length,
      validations,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


