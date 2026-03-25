import { Project } from "../models/project.model.js";
import { Sprint } from "../models/sprint.model.js";
import { Task } from "../models/task.model.js";
import { UserStory } from "../models/UserStory.model.js";

// --------------------------DONE-------------------------

// Create a new sprint
export const createSprint = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { number, title, start_date, end_date, status } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (!number || !title || !start_date || !end_date || !status) {
      return res.status(400).json({
        error: "All fields (title, number, dates, and status) are required.",
      });
    }
    const existingSprint = await Sprint.findOne({
      project_id: projectId,
      number,
    });

    if (existingSprint) {
      return res.status(400).json({
        error: `Sprint number ${number} already exists in this project.`,
      });
    }

    // Ensure sequential sprint numbering: previous sprint must exist (except for sprint 1)
    if (number > 1) {
      const previousSprint = await Sprint.findOne({
        project_id: projectId,
        number: number - 1,
      });
      if (!previousSprint) {
        return res.status(400).json({
          error: `Cannot create sprint ${number}. Sprint ${number - 1} does not exist yet.`,
        });
      }
    }

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

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ error: errors });
    }

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

    // Fetch sprints for the project
    const sprints = await Sprint.find({ project_id: projectId }).sort("number");

    if (!sprints || sprints.length === 0) {
      return res.status(200).json({
        message: "No sprints found for this project",
        sprints: [],
      });
    }

    res.status(200).json({
      message: `${sprints.length} sprint(s) found`,
      sprints,
    });
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
    const updates = req.body;

    const sprint = await Sprint.findById(sprintId);
    if (!sprint) {
      return res.status(404).json({ error: "Sprint not found" });
    }

    const allowedFields = Object.keys(Sprint.schema.paths); // all fields defined in the schema
    const updateFields = Object.keys(updates);

    for (let field of updateFields) {
      if (!allowedFields.includes(field)) {
        return res.status(400).json({
          error: `Field '${field}' does not exist in the Sprint model.`,
        });
      }
    }

    if (updates.number && updates.number !== sprint.number) {
      const existingSprint = await Sprint.findOne({
        project_id: sprint.project_id,
        number: updates.number,
      });

      if (existingSprint) {
        return res.status(400).json({
          error: `Sprint number ${updates.number} already exists in this project.`,
        });
      }
    }

    const updatedSprint = await Sprint.findByIdAndUpdate(sprintId, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Sprint updated successfully",
      sprint: updatedSprint,
    });
  } catch (error) {
    console.error("Error updating sprint:", error);

    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ error: "Validation error: " + error.message });
    }

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

    const sprint = await Sprint.findById(sprintId);
    if (!sprint) return res.status(404).json({ error: "Sprint not found" });

    // tjib user stories du sprint
    const userStories = await UserStory.find({ sprintId: sprint });

    // tjib toutes les taches du sprint
    const tasks = await Task.find({ sprintId: sprint });

    //  Compter par statut
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
