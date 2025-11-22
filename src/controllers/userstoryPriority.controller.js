// src/controllers/userstoryPriority.controller.js
const UserStory = require("../models/UserStory");
const mongoose = require("mongoose");

/**
 * FILTER + SORT + PAGINATION
 * /projects/:projectId/sprints/:sprintId/userStories/filter
 */
exports.getUserStoriesByPriority = async (req, res) => {
  try {
    const { projectId, sprintId } = req.params;
    const { priorite, sort = "asc", page = 1, limit = 10 } = req.query;

    const filter = {
      sprint: sprintId,
      projet: projectId,
    };

    // Si l'utilisateur filtre par priorité
    if (priorite) {
      filter.priorite = priorite;
    }

    const skip = (page - 1) * limit;

    const userStories = await UserStory.find(filter)
      .sort({ priorite: sort === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("sprint");

    const total = await UserStory.countDocuments(filter);

    res.json({
      message: "User Stories filtrées avec succès",
      userStories,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE PRIORITY
 * /projects/:projectId/sprints/:sprintId/userStories/:userStoryId/priority
 */
exports.updateUserStoryPriority = async (req, res) => {
  try {
    const { projectId, sprintId, userStoryId } = req.params;
    const { priorite } = req.body;

    const validPriorities = ["Haute", "Moyenne", "Basse"];
    if (!validPriorities.includes(priorite)) {
      return res.status(400).json({ message: "Priorité invalide" });
    }

    const userStory = await UserStory.findOneAndUpdate(
      {
        _id: userStoryId,
        sprint: sprintId,
        projet: projectId,
      },
      {
        priorite,
        dateModification: Date.now(),
      },
      { new: true }
    );

    if (!userStory) {
      return res.status(404).json({ message: "User Story non trouvée" });
    }

    res.json({
      message: "Priorité mise à jour avec succès",
      userStory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * STATS BY PRIORITY
 * /projects/:projectId/sprints/:sprintId/userStories/stats/priority
 */
exports.getUserStoriesStatsByPriority = async (req, res) => {
  try {
    const { projectId, sprintId } = req.params;

    const stats = await UserStory.aggregate([
      {
        $match: {
          sprint: new mongoose.Types.ObjectId(sprintId),
          projet: new mongoose.Types.ObjectId(projectId),
        },
      },
      {
        $group: {
          _id: "$priorite",
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      Haute: 0,
      Moyenne: 0,
      Basse: 0,
      total: 0,
    };

    stats.forEach((item) => {
      result[item._id] = item.count;
      result.total += item.count;
    });

    res.json({
      message: "Statistiques par priorité récupérées",
      stats: result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
