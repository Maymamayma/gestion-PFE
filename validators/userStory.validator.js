

import { z } from 'zod';
import mongoose from 'mongoose';

//  function to check for a valid MongoDB ObjectId.

const objectId = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: "Invalid ID format provided in URL.",
});

// Schema for CREATING a User Story  
export const createUserStorySchema = z.object({
  // Validate the request body
  body: z.object({
    title: z.string({ required_error: "Title is required." })
             .min(3, "Title must be at least 3 characters long.")
             .max(255, "Title cannot exceed 255 characters."),

    description: z.string({ required_error: "Description is required." })
                   .min(10, "Description must be at least 10 characters long."),

    start_date: z.string().transform((val, ctx) => {
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        ctx.addIssue({ code: 'invalid_date', message: "Invalid start date." });
        return z.NEVER;
      }
      return date;
    }),

    end_date: z.string().transform((val, ctx) => {
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        ctx.addIssue({ code: 'invalid_date', message: "Invalid end date." });
        return z.NEVER;
      }
      return date;
    }),
  }),
  // Validate the URL parameters
  params: z.object({
    projectId: objectId,
    sprintId: objectId,
  }),
});

//   Schema for UPDATING a User Story  
export const updateUserStorySchema = z.object({
  // For updates, the body fields are all optional.
  body: createUserStorySchema.shape.body.partial(),
  // But the IDs in the URL are still required and must be valid.
  params: z.object({
    projectId: objectId,
    sprintId: objectId,
    userStoryId: objectId,
  }),
});

//   Schema for GETTING, LISTING, or DELETING  
//  we only need to validate the URL parameters.
export const userStoryParamsSchema = z.object({
  params: z.object({
    projectId: objectId,
    sprintId: objectId,
    userStoryId: objectId.optional(), // userStoryId is not present in the "list" route
  }),
});