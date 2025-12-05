import { create } from "../services/userStory.service.js";

export const createUserStory = async (req, res) => {
  try {
    const { projectId, sprintId } = req.params;

    const newStory = await create({
      ...req.body,
      projectId,
      sprintId,
    });

    res.status(201).json(newStory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const listUserStories = async (req, res) => {
  try {
    const { projectId, sprintId } = req.params;

    const stories = await UserStoryService.list(projectId, sprintId);
    res.json(stories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const getUserStory = async (req, res) => {
  try {
    const { userStoryId } = req.params;
    const story = await UserStoryService.getById(userStoryId);

    if (!story) return res.status(404).json({ error: "User story not found" });

    res.json(story);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const updateUserStory = async (req, res) => {
  try {
    const { projectId,sprintId,userStoryId } = req.params;

    const updated = await UserStoryService.update(
      userStoryId,
      projectId,
      sprintId,
      req.body);

    if (!updated)
      return res.status(404).json({ error: "User story not found" });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const deleteUserStory = async (req, res) => {
  try {
    const { projectId, sprintId, userStoryId } = req.params;

    const deleted = await UserStoryService.remove(
      userStoryId,
      projectId,
      sprintId
    );

    if (!deleted)
      return res.status(404).json({ error: "User story not found" });

    res.json({ message: "User story deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
