import { z } from "zod";

// Validation schema for updating task status
const updateTaskStatusSchema = z.object({
  body: z.object({
    status: z.enum(["ToDo", "InProgress", "Standby", "Done"], {
      required_error: "Status is required",
      invalid_type_error: "Status must be one of: ToDo, InProgress, Standby, or Done",
    }),

    notes: z
      .string()
      .max(500, "Notes cannot exceed 500 characters")
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

export { updateTaskStatusSchema };
