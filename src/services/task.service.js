import { Task } from "../models/Task.model.js";

export const TaskService = {
  create: (data) => Task.create(data),
  list: (projectId, filters = {}) => {
    const query = { projectId, ...filters };
    return Task.find(query).populate("userStoryId").populate("sprintId");
  },
  getById: (id) =>
    Task.findById(id).populate("userStoryId").populate("sprintId"),
  update: (id, data) => {
    data.updatedAt = Date.now();
    return Task.findByIdAndUpdate(id, data, { new: true });
  },
  delete: (id) => Task.findByIdAndDelete(id),
};
