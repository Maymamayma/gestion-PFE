import { Validation } from "../models/validation.model.js";

export const create = (data) => Validation.create(data);

export const listByTask = (taskId) =>
  Validation.find({ taskId }).populate("validatedBy", "user_name email");

export const listByReunion = (reunionId) =>
  Validation.find({ reunionId }).populate("validatedBy", "user_name email");
