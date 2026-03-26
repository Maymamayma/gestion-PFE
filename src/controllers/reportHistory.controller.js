import path from "path";
import ReportHistoryService from "../services/reportHistory.service.js";
export const listHistory = async (req, res) => {
  try {
    const { projectId } = req.params;

    const reports = await ReportHistoryService.listReports(projectId);

    if (!reports || reports.length === 0) {
      return res.status(404).json({ error: "No reports found" });
    }

    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const downloadReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await ReportHistoryService.getReportById(reportId);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    const filePath = path.resolve(report.filePath);
    res.download(filePath, report.fileName);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
