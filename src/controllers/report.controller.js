import { createVersion, listByProject } from "../services/report.service.js";

export const uploadReportVersion = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { date, version } = req.body;
    if (!version) {
      return res.status(400).json({ error: "Version is required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "PDF file is required" });
    }

    const report = await createVersion(
      projectId,
      date,
      version,
      req.file.filename,
      req.file.path
    );

    res.status(201).json({
      message: "Report version uploaded successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listReportsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const reports = await listByProject(projectId);

    res.json({
      count: reports.length,
      reports,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
