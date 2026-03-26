import { Report } from "../models/report.model.js";

export default {
  async listReports(projectId) {
    return Report.find({ projectId }).sort({ version: -1 });
  },
  async getReportById(reportId) {
    return Report.findById(reportId);
  },
};
