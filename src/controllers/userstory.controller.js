const UserStoryService = require("../services/userStory.service");

module.exports = {
  createUserStory: async (req, res) => {
    try {
      const { projectId, sprintId } = req.params;

      const newStory = await UserStoryService.create({
        ...req.body,
        projectId,
        sprintId,
      });

      res.status(201).json(newStory);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  listUserStories: async (req, res) => {
    try {
      const { projectId, sprintId } = req.params;

      const stories = await UserStoryService.list(projectId, sprintId);
      res.json(stories);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getUserStory: async (req, res) => {
    try {
      const { userStoryId } = req.params;
      const story = await UserStoryService.getById(userStoryId);

      if (!story)
        return res.status(404).json({ error: "User story not found" });

      res.json(story);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateUserStory: async (req, res) => {
    try {
      const { userStoryId } = req.params;

      const updated = await UserStoryService.update(userStoryId, req.body);

      if (!updated)
        return res.status(404).json({ error: "User story not found" });

      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteUserStory: async (req, res) => {
    try {
      const { userStoryId } = req.params;

      const deleted = await UserStoryService.delete(userStoryId);

      if (!deleted)
        return res.status(404).json({ error: "User story not found" });

      res.json({ message: "User story deleted" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};
