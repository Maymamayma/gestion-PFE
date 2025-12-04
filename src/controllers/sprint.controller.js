import { Sprint } from "../models/Sprint.model.js";
import { Project } from "../models/Project.model.js";

// Create a new sprint
export const createSprint = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { number, name, start_date, end_date, status } = req.body;

    // Check if project exists
    const project = await Project.fetchProjectById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Create sprint
    const sprint = await Sprint.create({
      project_id: projectId,
      number,
      name,
      start_date,
      end_date,
      status,
    });

    res.status(201).json({
      message: "Sprint created successfully",
      sprint,
    });
  } catch (error) {
    console.error("Error creating sprint:", error);

    // Handle unique validation error
    if (error.code === 11000) {
      return res.status(400).json({
        error: "Sprint number must be unique within the same project.",
      });
    }

    res.status(500).json({ error: "Server error" });
  }
};

// Get all sprints of a project
export const getProjectSprints = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check if project exists
    const project = await Project.fetchProjectById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    
    const sprints = await Sprint.find({ project_id: projectId }).sort("number");

    res.status(200).json(sprints);
  } catch (error) {
    console.error("Error fetching sprints:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get one sprint by ID
export const getSprintById = async (req, res) => {
  try {
    const { sprintId } = req.params;

    const sprint = await Sprint.findById(sprintId);

    if (!sprint) {
      return res.status(404).json({ error: "Sprint not found" });
    }

    res.status(200).json(sprint);
  } catch (error) {
    console.error("Error fetching sprint:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update sprint
export const updateSprint = async (req, res) => {
  try {
    const { sprintId } = req.params;

    const updated = await Sprint.findByIdAndUpdate(sprintId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "Sprint not found" });
    }

    res.status(200).json({
      message: "Sprint updated successfully",
      sprint: updated,
    });
  } catch (error) {
    console.error("Error updating sprint:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        error: "Sprint number must be unique within the same project.",
      });
    }

    res.status(500).json({ error: "Server error" });
  }
};

// Delete sprint
export const deleteSprint = async (req, res) => {
  try {
    const { sprintId } = req.params;

    const deleted = await Sprint.findByIdAndDelete(sprintId);

    if (!deleted) {
      return res.status(404).json({ error: "Sprint not found" });
    }

    res.status(200).json({ message: "Sprint deleted successfully" });
  } catch (error) {
    console.error("Error deleting sprint:", error);
    res.status(500).json({ error: "Server error" });
  }
};
