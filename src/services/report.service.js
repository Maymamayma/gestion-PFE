const Report = require("../models/report.model");

module.exports = {
  async createVersion(projectId, date, fileName, filePath) {
    const lastReport = await Report.findOne({ projectId }).sort({
      version: -1,
    });

    const newVersion = lastReport ? lastReport.version + 1 : 1;

    return Report.create({
      projectId,
      date,
      fileName,
      filePath,
      version: newVersion,
    });
  },
};
