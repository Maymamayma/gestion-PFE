const ReportService = require("../services/report.service");

module.exports = {
  uploadReportVersion: async (req, res) => {
    try {
      const { projectId } = req.params;
      const { date } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: "PDF file is required" });
      }

      const report = await ReportService.createVersion(
        projectId,
        date,
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
  },
};
