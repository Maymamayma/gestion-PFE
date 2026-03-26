import mongoose from "mongoose";

const TaskHistorySchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
  oldStatus: {
    type: String,
    enum: ["ToDo", "InProgress", "Standby", "Done"],
    required: true,
  },
  newStatus: {
    type: String,
    enum: ["ToDo", "InProgress", "Standby", "Done"],
    required: true,
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  notes: {
    type: String,
  },
  changedAt: {
    type: Date,
    default: Date.now,
  },
});

export const TaskHistory = mongoose.model("TaskHistory", TaskHistorySchema);
