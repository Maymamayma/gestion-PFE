import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
  },
  status: {
    type: String,
    enum: ["ToDo", "InProgress", "Standby", "Done"],
    default: "ToDo",
  },
  priority: {
    type: String,
    enum: ["Basse", "Moyenne", "Haute"],
    required: true,
  },
  userStoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserStory",
    required: true,
  },
  sprintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sprint",
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Task = mongoose.model("Task", TaskSchema);
