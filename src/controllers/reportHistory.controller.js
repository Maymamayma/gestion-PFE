// controllers/reportHistory.controller.js

const ReportHistory = require("../models/reportHistory.model");

// Create a new report
exports.createReport = async (req, res) => {
  try {
    const report = new ReportHistory(req.body);
    await report.save();
    res.status(201).json({ message: "Report created successfully", report });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to create report", error: error.message });
  }
};

// Get all reports
exports.getAllReports = async (req, res) => {
  try {
    const reports = await ReportHistory.find();
    res.status(200).json(reports);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch reports", error: error.message });
  }
};

// Get a single report by ID
exports.getReportById = async (req, res) => {
  try {
    const report = await ReportHistory.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json(report);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch report", error: error.message });
  }
};

// Update a report by ID
exports.updateReport = async (req, res) => {
  try {
    const report = await ReportHistory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json({ message: "Report updated successfully", report });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to update report", error: error.message });
  }
};

// Delete a report by ID
exports.deleteReport = async (req, res) => {
  try {
    const report = await ReportHistory.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete report", error: error.message });
  }
};

exports.getReportHistory = async (req, res, next) => {
  try {
    const reports = await Report.find({ project: req.params.projectId }).sort(
      "-createdAt"
    );

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
