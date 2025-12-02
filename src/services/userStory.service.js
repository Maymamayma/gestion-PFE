import { UserStory } from "../models/UserStory.model.js";

export const create = (data) => UserStory.create(data);

export const list = (projectId, sprintId) =>
  UserStory.find({ projectId, sprintId });

export const getById = (id) => UserStory.findById(id);

export const update = (id, data) =>
  UserStory.findByIdAndUpdate(id, data, { new: true });

export const remove = (id) => UserStory.findByIdAndDelete(id);
