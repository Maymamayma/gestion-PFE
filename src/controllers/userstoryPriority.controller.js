const UserStory = require("../models/UserStory");

exports.prioritizeUserStory = async (req, res, next) => {
  try {
    const { userStoryId } = req.params;
    const { priority } = req.body; // priority est le nouveau rang (e.g., 1, 2, 3...)

    if (typeof priority !== "number" || priority < 0) {
      return res
        .status(400)
        .json({
          success: false,
          error: "La priorité doit être un nombre positif.",
        });
    }

    let userStory = await UserStory.findById(userStoryId);

    if (!userStory) {
      return res
        .status(404)
        .json({ success: false, error: "User Story non trouvée" });
    }

    userStory.priority = priority;
    await userStory.save();

    res.status(200).json({
      success: true,
      data: userStory,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getPrioritizedUserStories = async (req, res, next) => {
  try {
    const userStories = await UserStory.find({
      sprint: req.params.sprintId,
    }).sort("priority");

    res.status(200).json({
      success: true,
      count: userStories.length,
      data: userStories,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
