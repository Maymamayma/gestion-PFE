import { version } from "mongoose";
import { Report } from "../models/report.model.js";

export const createVersion = async (
  projectId,
  date,
  version,
  fileName,
  filePath
) => {
  const newVersion =
    version ||
    (await Report.findOne({ projectId }).sort({ version: -1 }))?.version + 1 ||
    1;

  return Report.create({
    projectId,
    date,
    fileName,
    filePath,
    version: newVersion,
  });
};

export const listByProject = async (projectId) => {
  return Report.find({ projectId }).sort({ createdAt: -1 });
};
