import { UserStory } from "../models/UserStory.model.js";

// Creates a new user story.

export const create = (data) => UserStory.create(data);

// Lists all user stories for a specific sprint within a specific project.
export const listBySprint = (projectId, sprintId) =>
  UserStory.find({ projectId, sprintId });

//Gets a single user story by its ID
export const getById = (id) => UserStory.findById(id);

//Updates a user story.

export const update = (userStoryId, projectId, sprintId, data) =>
  UserStory.findOneAndUpdate(
    { _id: userStoryId, projectId, sprintId },
    data,
    { new: true } // Returns the updated document
  );

//Removes a user story.
export const remove = (userStoryId, projectId, sprintId) =>
  UserStory.findOneAndDelete({ _id: userStoryId, projectId, sprintId });
