// src/controllers/userstory.controller.js
const UserStory = require("../models/UserStory");
const Sprint = require("../models/Sprint");

/**
 * CREATE User Story
 */
exports.createUserStory = async (req, res) => {
  try {
    const { projectId, sprintId } = req.params;
    const { titre, description, priorite, acceptance } = req.body;

    // Vérifier que le sprint appartient bien au projet
    const sprint = await Sprint.findOne({ _id: sprintId, projet: projectId });
    if (!sprint) {
      return res.status(404).json({ message: "Sprint non trouvé" });
    }

    const userStory = new UserStory({
      titre,
      description,
      priorite,
      acceptance,
      sprint: sprintId,
      projet: projectId,
    });

    await userStory.save();

    res.status(201).json({
      message: "User Story créée avec succès",
      userStory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET all User Stories of a Sprint
 */
exports.getUserStoriesBySprintId = async (req, res) => {
  try {
    const { projectId, sprintId } = req.params;

    const userStories = await UserStory.find({
      sprint: sprintId,
      projet: projectId,
    }).populate("sprint");

    res.json({
      message: "User Stories récupérées avec succès",
      userStories,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET One User Story
 */
exports.getUserStoryById = async (req, res) => {
  try {
    const { projectId, sprintId, userStoryId } = req.params;

    const userStory = await UserStory.findOne({
      _id: userStoryId,
      sprint: sprintId,
      projet: projectId,
    }).populate("sprint");

    if (!userStory) {
      return res.status(404).json({ message: "User Story non trouvée" });
    }

    res.json({
      message: "User Story récupérée avec succès",
      userStory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE User Story
 */
exports.updateUserStory = async (req, res) => {
  try {
    const { projectId, sprintId, userStoryId } = req.params;
    const { titre, description, priorite, acceptance } = req.body;

    const userStory = await UserStory.findOneAndUpdate(
      {
        _id: userStoryId,
        sprint: sprintId,
        projet: projectId,
      },
      {
        titre,
        description,
        priorite,
        acceptance,
        dateModification: Date.now(),
      },
      { new: true }
    );

    if (!userStory) {
      return res.status(404).json({ message: "User Story non trouvée" });
    }

    res.json({
      message: "User Story modifiée avec succès",
      userStory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE User Story
 */
exports.deleteUserStory = async (req, res) => {
  try {
    const { projectId, sprintId, userStoryId } = req.params;

    const userStory = await UserStory.findOneAndDelete({
      _id: userStoryId,
      sprint: sprintId,
      projet: projectId,
    });

    if (!userStory) {
      return res.status(404).json({ message: "User Story non trouvée" });
    }

    res.json({
      message: "User Story supprimée avec succès",
      userStory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
