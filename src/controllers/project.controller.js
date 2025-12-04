import mongoose from "mongoose";
import { Project } from "../models/project.model.js";
import { generateDashboard } from "../services/project.service.js";
//---------------------------------------DONE-----------------------
// Get all projects
export const fetchAllProjects = async (req, res) => {
  try {
    let query = {};
    //always do this why cuz java lay3itni
    const toObjectId = (id) => new mongoose.Types.ObjectId(id);
    const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

    if (
      req.query.student_id &&
      req.query.student_id !== "" &&
      isValidObjectId(req.query.student_id)
    ) {
      query.student_id = toObjectId(req.query.student_id);
    }

    if (
      req.query.company_supervisor_id &&
      req.query.company_supervisor_id !== "" &&
      isValidObjectId(req.query.company_supervisor_id)
    ) {
      query.company_supervisor_id = toObjectId(req.query.company_supervisor_id);
    }

    if (
      req.query.university_supervisor_id &&
      req.query.university_supervisor_id !== "" &&
      isValidObjectId(req.query.university_supervisor_id)
    ) {
      query.university_supervisor_id = toObjectId(
        req.query.university_supervisor_id
      );
    }

    const projects = await Project.find(query)
      .populate("student_id", "name email role")
      .populate("company_supervisor_id", "name email role")
      .populate("university_supervisor_id", "name email role")
      .sort({ createdAt: -1 });

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
    const project = new Project({
      title: req.body.title,
      description: req.body.description,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      student_id: req.body.student_id,
      company_supervisor_id: req.body.company_supervisor_id,
      university_supervisor_id: req.body.university_supervisor_id,
    });

    const returnedProject = await project.save();

    res.status(201).json({
      message: "Project created successfully",
      project: returnedProject,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).json({ message: "Validation error: " + err.message });
    } else {
      res.status(500).json({ message: "Server error: " + err.message });
    }
  }
};

// Get project by ID
export const fetchProjectById = async (req, res) => {
  //ti hay jawha bh ma8ir objectid , thaya3t 7yeti fi java
  try {
    const project = await Project.findById(req.params.id)
      .populate("student_id", "name email role")
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
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("student_id", "name email role")
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
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await project.deleteOne();

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

//---------------------------------------DONE-----------------------

export const getProjectDashboard = async (req, res) => {
  try {
    const projectId = req.params.id;

    const dashboard = await generateDashboard(projectId);

    return res.status(200).json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Dashboard error.",
    });
  }
};
