import mongoose from "mongoose";
import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";

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
      company_supervisor_id,
      university_supervisor_id,
    } = req.body;

    if (
      !title ||
      !description ||
      !start_date ||
      !end_date ||
      !Array.isArray(students) ||
      !company_supervisor_id ||
      !university_supervisor_id
    ) {
      return res.status(400).json({
        error:
          "All fields (title, description, dates, and user IDs) are required.",
      });
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

    // Company Supervisor
    const companySupervisor = await User.findById(company_supervisor_id);
    if (!companySupervisor || companySupervisor.role !== "encad_entreprise") {
      return res.status(400).json({
        error:
          "Invalid company_supervisor_id. User does not exist or is not a company supervisor.",
      });
    }

    // University Supervisor
    const universitySupervisor = await User.findById(university_supervisor_id);
    if (
      !universitySupervisor ||
      universitySupervisor.role !== "encad_universitaire"
    ) {
      return res.status(400).json({
        error:
          "Invalid university_supervisor_id. User does not exist or is not a university supervisor.",
      });
    }

    const project = new Project({
      title,
      description,
      start_date,
      end_date,
      students,
      company_supervisor_id,
      university_supervisor_id,
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
      }
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

// Delete a project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await project.deleteOne();

    res.json({ message: "Project deleted successfully" });
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
