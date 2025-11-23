const PriorityService = require("../services/userStoryPriority.service");

module.exports = {
  updatePriority: async (req, res) => {
    try {
      const { userStoryId } = req.params;
      const { priority } = req.body;

      if (!["High", "Medium", "Low"].includes(priority)) {
        return res.status(400).json({ error: "Invalid priority value" });
      }

      const updated = await PriorityService.setPriority(userStoryId, priority);

      if (!updated)
        return res.status(404).json({ error: "User story not found" });

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  listSorted: async (req, res) => {
    try {
      const { projectId, sprintId } = req.params;

      const stories = await PriorityService.listByPriority(projectId, sprintId);

      res.json(stories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
