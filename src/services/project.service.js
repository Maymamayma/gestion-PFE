import { formatDashboard } from "../helpers/ProjectDashboard.js";
import { Meeting } from "../models/meeting.model.js";
import { Project } from "../models/project.model.js";
import { Report } from "../models/report.model.js";
import { Sprint } from "../models/sprint.model.js";
import { Task } from "../models/task.model.js";
import { Validation } from "../models/validation.model.js";

export const generateDashboard = async (projectId) => {
  const project = await Project.findById(projectId).lean();

  if (!project) {
    throw new Error("Project not found");
  }

  //  Load all sprints of the project
  const sprints = await Sprint.find({ project_id: projectId }).lean();

  //  Load all tasks of the project
  const tasks = await Task.find({ project_id: projectId }).lean();

  //  Task statistics
  const totalTasks = tasks.length;

  const countByStatus = {
    todo: tasks.filter((t) => t.status === "ToDo").length,
    in_progress: tasks.filter((t) => t.status === "InProgress").length,
    standby: tasks.filter((t) => t.status === "Standby").length,
    done: tasks.filter((t) => t.status === "Done").length,
  };

  //  Progress percentage
  const percentDone =
    totalTasks > 0 ? Math.round((countByStatus.done / totalTasks) * 100) : 0;

  //  Pending validations
  const pendingValidations = await Validation.countDocuments({
    project_id: projectId,
    status: "pending",
  });

  //  Latest meetings
  const lastMeetings = await Meeting.find({ project_id: projectId })
    .sort({ date: -1 })
    .limit(5)
    .lean();

  //  Latest reports
  const lastReports = await Report.find({ project_id: projectId })
    .sort({ uploaded_at: -1 })
    .limit(5)
    .lean();

  //  Timeline (combined chronological events)
  const journal = [
    ...tasks.map((t) => ({ type: "task", date: t.updatedAt, data: t })),
    ...lastMeetings.map((m) => ({ type: "meeting", date: m.date, data: m })),
    ...lastReports.map((r) => ({
      type: "report",
      date: r.uploaded_at,
      data: r,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)); // descending order

  //  Final dashboard object
  return formatDashboard({
    project,
    sprints,
    stats: {
      totalTasks,
      countByStatus,
      percentDone,
      pendingValidations,
    },
    lastMeetings,
    lastReports,
    journal,
  });
};
