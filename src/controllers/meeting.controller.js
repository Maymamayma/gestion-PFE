import * as MeetingService from "../services/meeting.service.js";
import * as ValidationService from "../services/validation.service.js";
import { Project } from "../models/project.model.js";
import { UserStory } from "../models/UserStory.model.js";
import { Task } from "../models/task.model.js";
import { Report } from "../models/report.model.js";

// Create a new meeting (Student only)
export const createMeeting = async (req, res) => {
  try {
    const { projectId, datePlanification, ordreDuJour, referenceType, referenceId } = req.body;
    const userId = req.auth?.id;

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Projet non trouvé" });
    }

    // Verify reference if provided
    if (referenceType && referenceId) {
      let referenceExists = false;
      
      switch (referenceType) {
        case "UserStory":
          referenceExists = await UserStory.findById(referenceId);
          break;
        case "Task":
          referenceExists = await Task.findById(referenceId);
          break;
        case "Report":
          referenceExists = await Report.findById(referenceId);
          break;
      }

      if (!referenceExists) {
        return res.status(404).json({ 
          error: `${referenceType} référencé non trouvé` 
        });
      }
    }

    const meeting = await MeetingService.create({
      projectId,
      datePlanification,
      ordreDuJour,
      referenceType: referenceType || null,
      referenceId: referenceId || null,
      createdBy: userId,
    });

    res.status(201).json({
      message: "Réunion créée avec succès",
      reunion: meeting,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all meetings with optional filters
export const getAllMeetings = async (req, res) => {
  try {
    const { projectId } = req.query;
    const filters = {};

    if (projectId) {
      filters.projectId = projectId;
    }

    const meetings = await MeetingService.getAll(filters);

    res.json({
      count: meetings.length,
      reunions: meetings,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get meeting by ID
export const getMeetingById = async (req, res) => {
  try {
    const { id } = req.params;

    const meeting = await MeetingService.getById(id);

    if (!meeting) {
      return res.status(404).json({ error: "Réunion non trouvée" });
    }

    res.json(meeting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update meeting (Student only, before completion)
export const updateMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    const { datePlanification, ordreDuJour, referenceType, referenceId } = req.body;

    const meeting = await MeetingService.getById(id);

    if (!meeting) {
      return res.status(404).json({ error: "Réunion non trouvée" });
    }

    if (meeting.statut === "Effectuee") {
      return res.status(400).json({ 
        error: "Impossible de modifier une réunion déjà effectuée" 
      });
    }

    if (meeting.statut === "Annulee") {
      return res.status(400).json({ 
        error: "Impossible de modifier une réunion annulée" 
      });
    }

    // Verify reference if provided
    if (referenceType && referenceId) {
      let referenceExists = false;
      
      switch (referenceType) {
        case "UserStory":
          referenceExists = await UserStory.findById(referenceId);
          break;
        case "Task":
          referenceExists = await Task.findById(referenceId);
          break;
        case "Report":
          referenceExists = await Report.findById(referenceId);
          break;
      }

      if (!referenceExists) {
        return res.status(404).json({ 
          error: `${referenceType} référencé non trouvé` 
        });
      }
    }

    const updateData = {};
    if (datePlanification) updateData.datePlanification = datePlanification;
    if (ordreDuJour) updateData.ordreDuJour = ordreDuJour;
    if (referenceType !== undefined) updateData.referenceType = referenceType || null;
    if (referenceId !== undefined) updateData.referenceId = referenceId || null;

    const updatedMeeting = await MeetingService.update(id, updateData);

    res.json({
      message: "Réunion mise à jour avec succès",
      reunion: updatedMeeting,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Complete meeting with actual report (Student only)
export const completeMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    const { compteRendu } = req.body;

    const meeting = await MeetingService.getById(id);

    if (!meeting) {
      return res.status(404).json({ error: "Réunion non trouvée" });
    }

    if (meeting.statut === "Effectuee") {
      return res.status(400).json({ 
        error: "Cette réunion est déjà effectuée" 
      });
    }

    if (meeting.statut === "Annulee") {
      return res.status(400).json({ 
        error: "Impossible de compléter une réunion annulée" 
      });
    }

    const completedMeeting = await MeetingService.complete(id, compteRendu);

    res.json({
      message: "Réunion complétée avec succès",
      reunion: completedMeeting,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel meeting (Student only)
export const cancelMeeting = async (req, res) => {
  try {
    const { id } = req.params;

    const meeting = await MeetingService.getById(id);

    if (!meeting) {
      return res.status(404).json({ error: "Réunion non trouvée" });
    }

    if (meeting.statut === "Effectuee") {
      return res.status(400).json({ 
        error: "Impossible d'annuler une réunion déjà effectuée" 
      });
    }

    const cancelledMeeting = await MeetingService.cancel(id);

    res.json({
      message: "Réunion annulée avec succès",
      reunion: cancelledMeeting,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Validate meeting content (University supervisor only)
// This creates a Validation with type "ContenuReunion"
export const validateMeetingContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { estValide, commentaire } = req.body;
    const userId = req.auth?.id;

    const meeting = await MeetingService.getById(id);

    if (!meeting) {
      return res.status(404).json({ error: "Réunion non trouvée" });
    }

    if (meeting.statut !== "Effectuee") {
      return res.status(400).json({ 
        error: "Impossible de valider une réunion non effectuée" 
      });
    }

    // Create a validation of type "ContenuReunion"
    const validation = await ValidationService.create({
      reunionId: id,
      estValide,
      commentaire: commentaire || "",
      typeValidation: "ContenuReunion",
      validatedBy: userId,
    });

    res.json({
      message: "Contenu de la réunion validé avec succès",
      validation,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete meeting (Student only)
export const deleteMeeting = async (req, res) => {
  try {
    const { id } = req.params;

    const meeting = await MeetingService.getById(id);

    if (!meeting) {
      return res.status(404).json({ error: "Réunion non trouvée" });
    }

    await MeetingService.deleteById(id);

    res.json({
      message: "Réunion supprimée avec succès",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get upcoming meetings
export const getUpcomingMeetings = async (req, res) => {
  try {
    const { projectId } = req.query;
    const meetings = await MeetingService.getUpcoming(projectId || null);

    res.json({
      count: meetings.length,
      reunions: meetings,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get completed meetings
export const getCompletedMeetings = async (req, res) => {
  try {
    const { projectId } = req.query;
    const meetings = await MeetingService.getCompleted(projectId || null);

    res.json({
      count: meetings.length,
      reunions: meetings,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get cancelled meetings
export const getCancelledMeetings = async (req, res) => {
  try {
    const { projectId } = req.query;
    const meetings = await MeetingService.getCancelled(projectId || null);

    res.json({
      count: meetings.length,
      reunions: meetings,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
