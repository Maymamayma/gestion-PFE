const UserStory = require("../models/UerStory.model");

module.exports = {
  create: (data) => UserStory.create(data),

  list: (projectId, sprintId) => UserStory.find({ projectId, sprintId }),

  getById: (id) => UserStory.findById(id),

  update: (id, data) => UserStory.findByIdAndUpdate(id, data, { new: true }),

  delete: (id) => UserStory.findByIdAndDelete(id),
};
