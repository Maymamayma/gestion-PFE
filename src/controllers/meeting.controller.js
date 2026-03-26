import { Project } from "../models/project.model.js";
import { Report } from "../models/report.model.js";
import { Task } from "../models/task.model.js";
import { UserStory } from "../models/UserStory.model.js";
import * as MeetingService from "../services/meeting.service.js";
import * as ValidationService from "../services/validation.service.js";

const EMPTY_PROJECT_FILTER = { $in: [] };

const normalizeMeetingUrl = (value) => {
  if (value === undefined || value === null) {
    return "";
  }

  const normalizedValue = typeof value === "string" ? value.trim() : "";
  return normalizedValue;
};

const buildProjectAccessFilter = async (user, requestedProjectId) => {
  const userId = user?._id ?? user?.id;

  if (!userId || !user?.role) {
    return EMPTY_PROJECT_FILTER;
  }

  if (user.role === "admin") {
    return requestedProjectId || null;
  }

  const projectQueryByRole = {
    etudiant: { students: userId },
    encad_universitaire: { university_supervisor_id: userId },
    encad_entreprise: { company_supervisor_id: userId },
  };

  const roleProjectQuery = projectQueryByRole[user.role];
  if (!roleProjectQuery) {
    return EMPTY_PROJECT_FILTER;
  }

  const projects = await Project.find(roleProjectQuery).select("_id");
  const allowedProjectIds = projects.map((project) => String(project._id));

  if (requestedProjectId) {
    return allowedProjectIds.includes(String(requestedProjectId))
      ? requestedProjectId
      : EMPTY_PROJECT_FILTER;
  }

  return { $in: allowedProjectIds };
};

// Create a new meeting (Student only)
export const createMeeting = async (req, res) => {
  try {
    const {
      projectId,
      datePlanification,
      ordreDuJour,
      meeting_URL,
      referenceType,
      referenceId,
    } = req.body;
    const userId = req.user?.id;
    const hasReferenceType = Boolean(referenceType);
    const hasReferenceId = Boolean(referenceId);

    if (hasReferenceType !== hasReferenceId) {
      return res.status(400).json({
        error: "referenceType and referenceId must be provided together.",
      });
    }

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Verify reference if provided and belongs to the same project
    if (referenceType && referenceId) {
      let referenceExists = false;
      
      switch (referenceType) {
        case "UserStory":
          referenceExists = await UserStory.findOne({ 
            _id: referenceId, 
            projectId: projectId 
          });
          break;
        case "Task":
          referenceExists = await Task.findOne({ 
            _id: referenceId, 
            projectId: projectId 
          });
          break;
        case "Report":
          referenceExists = await Report.findOne({ 
            _id: referenceId, 
            projectId: projectId 
          });
          break;
      }

      if (!referenceExists) {
        return res.status(404).json({ 
          error: `${referenceType} Reference not found or does not belong to this project.` 
        });
      }
    }

    const meeting = await MeetingService.create({
      projectId,
      datePlanification,
      ordreDuJour,
      meeting_URL: normalizeMeetingUrl(meeting_URL),
      referenceType: referenceType || null,
      referenceId: referenceId || null,
      createdBy: userId,
    });

    res.status(201).json({
      message: "Meeting created successfully",
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

    const projectFilter = await buildProjectAccessFilter(req.user, projectId);
    if (projectFilter) filters.projectId = projectFilter;

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
      return res.status(404).json({ error: "Meeting not found" });
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
    const { datePlanification, ordreDuJour, meeting_URL, referenceType, referenceId } =
      req.body;
    const hasReferenceType = Boolean(referenceType);
    const hasReferenceId = Boolean(referenceId);

    if (hasReferenceType !== hasReferenceId) {
      return res.status(400).json({
        error: "referenceType and referenceId must be provided together.",
      });
    }

    const meeting = await MeetingService.getById(id);

    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    if (meeting.statut === "Effectuee") {
      return res.status(400).json({ 
        error: "Cannot modify a meeting that has already been completed." 
      });
    }

    if (meeting.statut === "Annulee") {
      return res.status(400).json({ 
        error: "Cannot modify a cancelled meeting." 
      });
    }

    // Verify reference if provided and belongs to the same project
    if (referenceType && referenceId) {
      let referenceExists = false;
      
      switch (referenceType) {
        case "UserStory":
          referenceExists = await UserStory.findOne({ 
            _id: referenceId, 
            projectId: meeting.projectId 
          });
          break;
        case "Task":
          referenceExists = await Task.findOne({ 
            _id: referenceId, 
            projectId: meeting.projectId 
          });
          break;
        case "Report":
          referenceExists = await Report.findOne({ 
            _id: referenceId, 
            projectId: meeting.projectId 
          });
          break;
      }

      if (!referenceExists) {
        return res.status(404).json({ 
          error: `${referenceType} Reference not found or does not belong to the project.` 
        });
      }
    }

    const updateData = {};
    if (datePlanification) updateData.datePlanification = datePlanification;
    if (ordreDuJour) updateData.ordreDuJour = ordreDuJour;
    if (meeting_URL !== undefined) updateData.meeting_URL = normalizeMeetingUrl(meeting_URL);
    if (referenceType !== undefined) updateData.referenceType = referenceType || null;
    if (referenceId !== undefined) updateData.referenceId = referenceId || null;

    const updatedMeeting = await MeetingService.update(id, updateData);

    res.json({
      message: "Meeting updated successfully.",
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
      return res.status(404).json({ error: "Meeting not found" });
    }

    if (meeting.statut === "Effectuee") {
      return res.status(400).json({ 
        error: "This meeting has already been completed" 
      });
    }

    if (meeting.statut === "Annulee") {
      return res.status(400).json({ 
        error: "Impossible to complete a canceled meeting" 
      });
    }

    const completedMeeting = await MeetingService.complete(id, compteRendu);

    res.json({
      message: "Meeting completed successfully",
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
      return res.status(404).json({ error: "Meeting not found" });
    }

    if (meeting.statut === "Effectuee") {
      return res.status(400).json({ 
        error: "Cannot cancel an already completed meeting" 
      });
    }

    const cancelledMeeting = await MeetingService.cancel(id);

    res.json({
      message: "Meeting canceled successfully",
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
    const userId = req.user?.id;

    // console.log("Validating meeting content:", { id, estValide, commentaire, userId });

    const meeting = await MeetingService.getById(id);

    // console.log("Fetched meeting for validation:", meeting);

    if (!meeting) {
      return res.status(404).json({ error: "Meeting noy found" });
    }

    if (meeting.statut !== "Effectuee") {
      return res.status(400).json({ 
        error: "Cannot validate a meeting that has not been completed " 
      });
    }

    if (meeting.validation?.dateValidation) {
      return res.status(400).json({
        error: "This meeting report has already been validated.",
      });
    }

    // console.log("Creating validation record...");

    // Create a validation of type "ContenuReunion"
    const validation = await ValidationService.create({
      reunionId: id,
      estValide,
      commentaire: commentaire || "",
      typeValidation: "ContenuReunion",
      validatedBy: userId,
    });

    const updatedMeeting = await MeetingService.update(id, {
      validation: {
        estValide,
        commentaire: commentaire || "",
        validePar: String(userId || ""),
        dateValidation: new Date(),
      },
    });

    // console.log("Validation record created:", validation);

    res.json({
      message: "Meeting content validated successfully.",
      validation,
      reunion: updatedMeeting,
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
      return res.status(404).json({ error: "Meeting not found" });
    }

    await MeetingService.deleteById(id);

    res.json({
      message: "Meeting deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get upcoming meetings
export const getUpcomingMeetings = async (req, res) => {
  try {
    const { projectId } = req.query;
    const projectFilter = await buildProjectAccessFilter(req.user, projectId);
    const meetings = await MeetingService.getUpcoming(projectFilter || null);

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
    const projectFilter = await buildProjectAccessFilter(req.user, projectId);
    const meetings = await MeetingService.getCompleted(projectFilter || null);

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
    const projectFilter = await buildProjectAccessFilter(req.user, projectId);
    const meetings = await MeetingService.getCancelled(projectFilter || null);

    res.json({
      count: meetings.length,
      reunions: meetings,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
