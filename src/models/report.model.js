import mongoose from "mongoose";
const ReportSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  date: { type: Date, required: true },

  fileName: { type: String, required: true },
  filePath: { type: String, required: true },

  version: { type: Number, required: true, default: 1 },

  createdAt: { type: Date, default: Date.now },
});

export const Report = mongoose.model("Report", ReportSchema);
