import { z } from "zod";

// Validation schema for validating a task
const validateTaskSchema = z.object({
  body: z.object({
    isValid: z.boolean({
      required_error: "The isValid field is required",
      invalid_type_error: "isValid must be a boolean (true/false)",
    }),

    comment: z
      .string()
      .max(1000, "Comment cannot exceed 1000 characters")
      .trim()
      .optional(),
  }),

  params: z.object({
    taskId: z
      .string({
        required_error: "Task ID is required",
      })
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid task ID"),
  }),
});

export { validateTaskSchema };
