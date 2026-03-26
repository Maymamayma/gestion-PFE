import { z } from 'zod';
import mongoose from 'mongoose';

// Schema to validate request params. Checks if the projectId is a valid MongoDB ObjectId.
export const reportParamsSchema = z.object({
  projectId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid project ID format.",
  }),
});

// Schema to validate the request body for uploading a new report version.
// Validates and transforms data to the correct types.
export const uploadReportBodySchema = z.object({
  // Date of the report version: expects a string, parses into a valid JS Date object
  date: z.string().transform((val, ctx) => {
    const date = new Date(val);
    if (isNaN(date.getTime())) {
      ctx.addIssue({
        code: 'invalid_date',
        message: "Invalid date format. Please provide a valid date string.",
      });
      return z.NEVER; // Stop processing if validation fails
    }
    return date; // Return the transformed Date object
  }),

  // Version number is mandatory
  version: z
    .string({ required_error: "Version number is required." })
    .min(1, "Version number cannot be empty."),

  // Notes are optional
  notes: z.string().optional(),
});
