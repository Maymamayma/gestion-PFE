import { Sprint } from "../models/Sprint.model.js";
import { Project } from "../models/Project.model.js";
import { UserStory } from "../models/UserStory.model.js";
import { Task } from "../models/task.model.js";

// --------------------------DONE-------------------------

// Create a new sprint
export const createSprint = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { number, title, start_date, end_date, status } = req.body;

    // 1. Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // 2. Check if sprint number already exists for this project
    const existingSprint = await Sprint.findOne({
      project_id: projectId,
      number,
    });

    if (existingSprint) {
      return res.status(400).json({
        error: `Sprint number ${number} already exists in this project.`,
      });
    }

    // 3. Create new sprint
    const sprint = await Sprint.create({
      project_id: projectId,
      number,
      title,
      start_date,
      end_date,
      status,
    });

    return res.status(201).json({
      message: "Sprint created successfully",
      sprint,
    });
  } catch (error) {
    console.error("Error creating sprint:", error);

    // Handle unique index error
    if (error.code === 11000) {
      return res.status(400).json({
        error: "Sprint number must be unique within the same project.",
      });
    }

    return res.status(500).json({ error: "Server error" });
  }
};

// Get all sprints of a project
export const getProjectSprints = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check if project exists
    const project = await Project.findById(projectId);
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

// --------------------------DONE-------------------------

export const getSprintDashboard = async (req, res) => {
  try {
    const { sprintId } = req.params;

    // 1. Vérifier que le sprint existe
    const sprint = await Sprint.findById(sprintId);
    if (!sprint) return res.status(404).json({ error: "Sprint not found" });

    // 2. Récupérer user stories du sprint
    const userStories = await UserStory.find({ sprint: sprintId });

    // 3. Récupérer toutes les tâches du sprint
    const tasks = await Task.find({ sprint: sprintId });

    // 4. Compter par statut
    const totalTasks = tasks.length;
    const todo = tasks.filter((t) => t.status === "ToDo").length;
    const inProgress = tasks.filter((t) => t.status === "InProgress").length;
    const standby = tasks.filter((t) => t.status === "Standby").length;
    const done = tasks.filter((t) => t.status === "Done").length;

    // 5. % d’avance
    const progress =
      totalTasks === 0 ? 0 : Math.round((done / totalTasks) * 100);

    // 6. Préparer le dashboard
    const dashboard = {
      sprintId,
      sprintName: sprint.name,
      totalUserStories: userStories.length,
      totalTasks,
      taskStatus: {
        ToDo: todo,
        InProgress: inProgress,
        Standby: standby,
        Done: done,
      },
      progressPercentage: progress,
    };

    res.json(dashboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
