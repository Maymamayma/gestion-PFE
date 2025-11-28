const Validation = require("../models/Validation.model");

module.exports = {
  create: (data) => Validation.create(data),

  listByTask: (taskId) =>
    Validation.find({ taskId }).populate("validatedBy", "user_name email"),

  listByReunion: (reunionId) =>
    Validation.find({ reunionId }).populate("validatedBy", "user_name email"),
};
