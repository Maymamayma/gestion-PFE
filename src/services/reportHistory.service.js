const Report = require("../models/report.model");

module.exports = {
  listReports: async (projectId) => {
    return Report.find({ projectId }).sort({ version: -1 });
  },

  getReportById: async (reportId) => {
    return Report.findById(reportId);
  },
};
