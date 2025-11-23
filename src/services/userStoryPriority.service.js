const UserStory = require("../models/UserStory.model");

module.exports = {
  setPriority: async (userStoryId, priority) => {
    return UserStory.findByIdAndUpdate(
      userStoryId,
      { priority },
      { new: true }
    );
  },

  listByPriority: async (projectId, sprintId) => {
    return UserStory.find({ projectId, sprintId }).sort({
      priority: 1,
    });
  },
};
