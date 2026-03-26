import mongoose from "mongoose";
import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";
import { Task } from "../models/task.model.js";
import { Sprint } from "../models/sprint.model.js";
import { UserStory } from "../models/UserStory.model.js";
import { generateDashboard } from "../services/project.service.js";
//---------------------------------------DONE-----------------------
// Get all projects
export const fetchAllProjects = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    let query = {};

    // Student → get projects where he is in students array
    if (role === "etudiant") {
      query.students = userId;
    }

    // University supervisor
    if (role === "encad_universitaire") {
      query.university_supervisor_id = userId;
    }

    // Company supervisor
    if (role === "encad_entreprise") {
      query.company_supervisor_id = userId;
    }

    const projects = await Project.find(query)
      .populate("students", "name email role")
      .populate("company_supervisor_id", "name email role")
      .populate("university_supervisor_id", "name email role")
      .sort({ createdAt: -1 });

    if (projects.length === 0) {
      return res.status(200).json({
        count: 0,
        message: "No projects found",
        projects: [],
      });
    }

    res.json({
      count: projects.length,
      projects,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error: " + err.message });
  }
};

// Create a project
export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      start_date,
      end_date,
      students,
      company_supervisor_email,
      university_supervisor_email,
    } = req.body;

    // Company Supervisor (optional)
    let companySupervisorId = null;
    if (company_supervisor_email) {
      const companySupervisor = await User.findOne({
        email: company_supervisor_email,
      });
      if (!companySupervisor || companySupervisor.role !== "encad_entreprise") {
        return res.status(400).json({
          error:
            "Invalid company_supervisor_email. User does not exist or is not a company supervisor.",
        });
      }
      companySupervisorId = companySupervisor._id;
    }

    // University Supervisor (optional)
    if (university_supervisor_email) {
      const universitySupervisor = await User.findOne({
        email: university_supervisor_email,
      });
      if (
        !universitySupervisor ||
        universitySupervisor.role !== "encad_universitaire"
      ) {
        return res.status(400).json({
          error:
            "Invalid university_supervisor_email. User does not exist or is not a university supervisor.",
        });
      }
    }
    if (students.length > 2) {
      return res.status(400).json({
        error: "A project can have a maximum of 2 students.",
      });
    }

    const uniqueStudents = new Set(students);
    if (uniqueStudents.size !== students.length) {
      return res.status(400).json({
        error: "Duplicate student IDs are not allowed.",
      });
    }
    // hethi bech ttchecki date ta3 endate cuz cant be in the past
    const today = new Date();
    const endDateObj = new Date(end_date);

    if (endDateObj < today.setHours(0, 0, 0, 0)) {
      return res.status(400).json({
        error: "End date must be today or in the future.",
      });
    }

    // Student
    for (let id of students) {
      const student = await User.findById(id);
      if (!student || student.role !== "etudiant") {
        return res.status(400).json({
          error: `Invalid student ID '${id}'. User not found or not a student.`,
        });
      }
    }

    // University Supervisor
    const universitySupervisor = await User.findOne({
      email: university_supervisor_email,
    });
    if (
      !universitySupervisor ||
      universitySupervisor.role !== "encad_universitaire"
    ) {
      return res.status(400).json({
        error:
          "Invalid university_supervisor_email. User does not exist or is not a university supervisor.",
      });
    }

    const project = new Project({
      title,
      description,
      start_date,
      end_date,
      students,
      ...(companySupervisorId && {
        company_supervisor_id: companySupervisorId,
      }),
      ...(universitySupervisor && {
        university_supervisor_id: universitySupervisor._id,
      }),
    });

    const returnedProject = await project.save();

    return res.status(201).json({
      message: "Project created successfully",
      project: returnedProject,
    });
  } catch (err) {
    console.error("Project creation error:", err);

    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error: " + err.message });
    }

    return res.status(500).json({ message: "Server error: " + err.message });
  }
};

// Get project by ID
export const fetchProjectById = async (req, res) => {
  //ti hay jawha bh ma8ir objectid , thaya3t 7yeti fi java
  try {
    const project = await Project.findById(req.params.projectId)
      .populate("students", "name email role")
      .populate("company_supervisor_id", "name email role")
      .populate("university_supervisor_id", "name email role");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// Update a project
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    //Validate fields in req.body yani ma nupdatich 7aja mouch mawjouda fil model
    const allowedFields = Object.keys(Project.schema.paths);
    const receivedFields = Object.keys(req.body);

    // Check if user tries to update a non-existing attribute
    for (let field of receivedFields) {
      if (!allowedFields.includes(field)) {
        return res.status(400).json({
          message: `Field '${field}' does not exist in Project model.`,
        });
      }
    }
    const updated = await Project.findByIdAndUpdate(
      req.params.projectId,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("students", "name email role")
      .populate("company_supervisor_id", "name email role")
      .populate("university_supervisor_id", "name email role");

    res.json({
      message: "Project updated successfully",
      project: updated,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).json({ message: "Validation error: " + err.message });
    } else {
      res.status(500).json({ message: "Server error: " + err.message });
    }
  }
};

// Add a member (student) to a project
export const addProjectMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required." });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "etudiant") {
      return res
        .status(400)
        .json({ error: "User not found or is not a student." });
    }

    if (project.students.some((id) => id.toString() === userId)) {
      return res
        .status(400)
        .json({ error: "Student is already a member of this project." });
    }

    if (project.students.length >= 2) {
      return res
        .status(400)
        .json({ error: "A project can have a maximum of 2 students." });
    }

    project.students.push(userId);
    await project.save();

    const populated = await Project.findById(projectId).populate(
      "students",
      "name email role",
    );

    res.status(200).json({
      message: "Member added successfully",
      project: populated,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

// Get project members (students) with count
export const getProjectMembers = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId).populate(
      "students",
      "name email role",
    );
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json({
      count: project.students.length,
      members: project.students,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

// Remove a member (student) from a project
export const removeProjectMember = async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    if (req.user._id.toString() === userId) {
      return res
        .status(400)
        .json({ error: "You cannot remove yourself from the project." });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const index = project.students.findIndex((id) => id.toString() === userId);
    if (index === -1) {
      return res
        .status(404)
        .json({ error: "Student is not a member of this project." });
    }

    project.students.splice(index, 1);
    await project.save();

    const populated = await Project.findById(projectId).populate(
      "students",
      "name email role",
    );

    res.status(200).json({
      message: "Member removed successfully",
      project: populated,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

// Delete a project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const projectId = project._id;

    // Delete all related tasks, user stories, and sprints
    await Task.deleteMany({ projectId });
    await UserStory.deleteMany({ projectId });
    await Sprint.deleteMany({ project_id: projectId });

    await project.deleteOne();

    res.json({ message: "Project and all related data deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

export const getProjectDashboard = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    const dashboard = await generateDashboard(projectId);

    return res.status(200).json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Dashboard error.",
    });
  }
};
//---------------------------------------DONE-----------------------

export const getAccountStats = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const role = req.user.role;

    // 1️⃣ Fetch projects based on role, using lean() to avoid ObjectId cast issues
    let projectQuery = {};
    if (role === "etudiant") projectQuery.students = userId;
    if (role === "encad_universitaire")
      projectQuery.university_supervisor_id = userId;
    if (role === "encad_entreprise")
      projectQuery.company_supervisor_id = userId;

    const projects = await Project.find(projectQuery).lean();

    // 2️⃣ Load all tasks for these projects
    const projectIds = projects.map((p) => p._id.toString());
    const tasks = await Task.find({ projectId: { $in: projectIds } }).lean();

    // 3️⃣ Compute stats safely
    const totalProjects = projects.length;
    const completedProjects = projects.filter(
      (p) => p.status === "COMPLETED",
    ).length;
    const activeProjects = projects.filter(
      (p) => !["COMPLETED", "CANCELLED"].includes(p.status),
    ).length;

    const myTasks = tasks.filter((t) => t.assigneeId === userId).length;
    const overdueIssues = tasks.filter(
      (t) => t.due_date && new Date(t.due_date) < new Date(),
    ).length;

    // 4️⃣ Return stats
    res.json({
      totalProjects,
      activeProjects,
      completedProjects,
      myTasks,
      overdueIssues,
    });
  } catch (err) {
    console.error("Stats fetching error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};
