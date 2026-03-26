import { z } from "zod";
import mongoose from "mongoose";
import { Sprint } from "../models/sprint.model.js";

// Function to check for a valid MongoDB ObjectId
const objectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ID format provided in URL.",
  });

// Schema for CREATING a User Story
export const createUserStorySchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: "Title is required." })
      .min(3, "Title must be at least 3 characters long.")
      .max(255, "Title cannot exceed 255 characters."),

    description: z
      .string({ required_error: "Description is required." })
      .min(10, "Description must be at least 10 characters long."),

    start_date: z.string().transform((val, ctx) => {
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        ctx.addIssue({ code: "invalid_date", message: "Invalid start date." });
        return z.NEVER;
      }
      return date;
    }),

    end_date: z.string().transform((val, ctx) => {
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        ctx.addIssue({ code: "invalid_date", message: "Invalid end date." });
        return z.NEVER;
      }
      return date;
    }),
  }),
  params: z.object({
    projectId: objectId,
    sprintId: objectId,
  }),
});

export const validateUserStoryDatesWithSprint = async (req, res, next) => {
  try {
    const { sprintId } = req.params;
    const { start_date, end_date } = req.body;

    // Fetch sprint
    const sprint = await Sprint.findById(sprintId);

    if (!sprint) {
      return res.status(404).json({
        error: "Sprint not found",
      });
    }

    // Parse dates
    const userStoryStart = new Date(start_date);
    const userStoryEnd = new Date(end_date);
    const sprintStart = new Date(sprint.start_date);
    const sprintEnd = new Date(sprint.end_date);

    // Normalize to remove time component
    userStoryStart.setHours(0, 0, 0, 0);
    userStoryEnd.setHours(0, 0, 0, 0);
    sprintStart.setHours(0, 0, 0, 0);
    sprintEnd.setHours(0, 0, 0, 0);

    // Validate user story dates are within sprint range
    if (userStoryStart < sprintStart || userStoryStart > sprintEnd) {
      return res.status(400).json({
        error: "Validation échouée",
        details: [
          {
            field: "start_date",
            message: `User story start date must be within sprint range (${
              sprint.start_date.toISOString().split("T")[0]
            } to ${sprint.end_date.toISOString().split("T")[0]}).`,
          },
        ],
      });
    }

    if (userStoryEnd < sprintStart || userStoryEnd > sprintEnd) {
      return res.status(400).json({
        error: "Validation failed",
        details: [
          {
            field: "end_date",
            message: `User story end date must be within sprint range (${
              sprint.start_date.toISOString().split("T")[0]
            } to ${sprint.end_date.toISOString().split("T")[0]}).`,
          },
        ],
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      error: "Error validating dates against sprint",
      message: error.message,
    });
  }
};

// Schema for UPDATING a User Story
export const updateUserStorySchema = z.object({
  body: createUserStorySchema.shape.body.partial(), // All body fields optional for updates
  params: z.object({
    projectId: objectId,
    sprintId: objectId,
    userStoryId: objectId,
  }),
});

// Schema for GETTING, LISTING, or DELETING a User Story
export const userStoryParamsSchema = z.object({
  params: z.object({
    projectId: objectId,
    sprintId: objectId,
    userStoryId: objectId.optional(), // userStoryId not required for list route
  }),
});
