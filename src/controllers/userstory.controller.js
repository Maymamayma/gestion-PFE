import { z } from "zod";
import * as UserStoryService from "../services/userStory.service.js";
import {
  createUserStorySchema,
  updateUserStorySchema,
  userStoryParamsSchema,
} from "../validators/userStory.validator.js"; 

// Handles Zod and other errors, sending a structured response
const handleErrors = (res, error) => {
  if (error instanceof z.ZodError) {
    // If it's a Zod validation error, send a 400 with detailed issues
    return res.status(400).json({ errors: error.flatten().fieldErrors });
  }
  // For other errors 
  console.error(error); // It's good practice to log the actual error on the server
  return res
    .status(500)
    .json({ message: "An internal server error occurred." });
};

export const createUserStory = async (req, res) => {
  try {
    //  Validate request body and params using the Zod schema
    const { body, params } = createUserStorySchema.parse({
      body: req.body,
      params: req.params,
    });

    //  Call the service with validated and typed data
    const newStory = await UserStoryService.create({
      ...body,
      projectId: params.projectId,
      sprintId: params.sprintId,
    });

    res.status(201).json(newStory);
  } catch (error) {
    handleErrors(res, error);
  }
};

export const listUserStories = async (req, res) => {
  try {
    // Validate only the route params
    const { params } = userStoryParamsSchema.parse({ params: req.params });

    // 2$Call the service
    const stories = await UserStoryService.listBySprint(
      params.projectId,
      params.sprintId
    );
    res.json(stories);
  } catch (error) {
    handleErrors(res, error);
  }
};

export const getUserStory = async (req, res) => {
  try {
    // Validate route params
    const { params } = userStoryParamsSchema.parse({ params: req.params });

    //  Call the service
    const story = await UserStoryService.getById(params.userStoryId);

    if (!story) {
      return res.status(404).json({ message: "User story not found" });
    }

    res.json(story);
  } catch (error) {
    handleErrors(res, error);
  }
};

export const updateUserStory = async (req, res) => {
  try {
    // 1. Validate request body and params
    const { body, params } = updateUserStorySchema.parse({
      body: req.body,
      params: req.params,
    });

    //  Call the service with validated data
    const updatedStory = await UserStoryService.update(
      params.userStoryId,
      params.projectId,
      params.sprintId,
      body
    );

    if (!updatedStory) {
      return res.status(404).json({ message: "User story not found" });
    }

    res.json(updatedStory);
  } catch (error) {
    handleErrors(res, error);
  }
};

export const deleteUserStory = async (req, res) => {
  try {
    //  Validate route params
    const { params } = userStoryParamsSchema.parse({ params: req.params });

    //  Call the service
    const deletedStory = await UserStoryService.remove(
      params.userStoryId,
      params.projectId,
      params.sprintId
    );

    if (!deletedStory) {
      return res.status(404).json({ message: "User story not found" });
    }

    res.status(200).json({ message: "User story deleted successfully" });
  } catch (error) {
    handleErrors(res, error);
  }
};
