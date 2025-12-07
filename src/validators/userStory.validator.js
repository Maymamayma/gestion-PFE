import { z } from "zod";
import mongoose from "mongoose";

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
      const now = new Date();
      if (isNaN(date.getTime())) {
        ctx.addIssue({ code: "invalid_date", message: "Invalid start date." });
        return z.NEVER;
      }
      if (date.getTime() < now.getTime()) {
        ctx.addIssue({
          code: "expired_date",
          message: "Start date cannot be in the past (expired).",
        });
        return z.NEVER;
      }

      return date;
    }),

    end_date: z.string().transform((val, ctx) => {
      const date = new Date(val);
      const now = new Date();
      if (isNaN(date.getTime())) {
        ctx.addIssue({ code: "invalid_date", message: "Invalid end date." });
        return z.NEVER;
      }
      if (date.getTime() < now.getTime()) {
        ctx.addIssue({
          code: "expired_date",
          message: "End date cannot be in the past (expired).",
        });
        return z.NEVER;
      }
      console.log("End date validated:", date);
      return date;
    }),
  }),
  params: z.object({
    projectId: objectId,
    sprintId: objectId,
  }),
});

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
