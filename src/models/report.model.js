import mongoose from "mongoose";
import { string } from "zod";
const ReportSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  date: { type: Date, required: true },

  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  // updated into string
  version: { type: String, required: true },

  notes: {
    type: String,
    trim: true, // trim to take off useless white spaces
    default: "",
  },

  createdAt: { type: Date, default: Date.now },
});

export const Report = mongoose.model("Report", ReportSchema);
