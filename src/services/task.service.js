import { Task } from "../models/Task.model.js";

export const TaskService = {
  createTask: (data) => Task.create(data),
  listTasks: (projectId, filters = {}) => {
    const query = { projectId, ...filters };
    return Task.find(query).populate("userStoryId").populate("sprintId");
  },
  getTaskById: (id) =>
    Task.findById(id).populate("userStoryId").populate("sprintId"),
  updateTask: (id, data) => {
    data.updatedAt = Date.now();
    return Task.findByIdAndUpdate(id, data, { new: true });
  },
  removeTask: (id) => Task.findByIdAndDelete(id),
};
