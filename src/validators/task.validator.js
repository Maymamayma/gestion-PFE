import { z } from "zod";

// Validation schema for creating a task
const createTaskSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: "Title is required",
        invalid_type_error: "Title must be a string",
      })
      .min(3, "Title must be at least 3 characters long")
      .max(255, "Title cannot exceed 255 characters")
      .trim(),

    description: z
      .string({
        required_error: "Description is required",
        invalid_type_error: "Description must be a string",
      })
      .min(10, "Description must be at least 10 characters long")
      .trim(),

    priority: z.enum(["Low", "Medium", "High"], {
      required_error: "Priority is required",
      invalid_type_error: "Priority must be: Low, Medium, or High",
    }),
  }),

  params: z.object({
    projectId: z
      .string({
        required_error: "Project ID is required",
      })
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid project ID"),

    sprintId: z
      .string({
        required_error: "Sprint ID is required",
      })
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid sprint ID"),

    userStoryId: z
      .string({
        required_error: "User Story ID is required",
      })
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid user story ID"),
  }),
});

// Validation schema for updating a task
const updateTaskSchema = z.object({
  body: z
    .object({
      title: z
        .string()
        .min(3, "Title must be at least 3 characters long")
        .max(255, "Title cannot exceed 255 characters")
        .trim()
        .optional(),

      description: z
        .string()
        .min(10, "Description must be at least 10 characters long")
        .trim()
        .optional(),

      priority: z.enum(["Low", "Medium", "High"]).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided for update",
    }),

  params: z.object({
    taskId: z
      .string({
        required_error: "Task ID is required",
      })
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid task ID"),
  }),
});

// Schema for task ID parameter
const taskIdParamSchema = z.object({
  params: z.object({
    taskId: z
      .string({
        required_error: "Task ID is required",
      })
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid task ID"),
  }),
});

// Schema for list query parameters
const listTasksQuerySchema = z.object({
  params: z.object({
    projectId: z
      .string({
        required_error: "Project ID is required",
      })
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid project ID"),
  }),

  query: z
    .object({
      sprintId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid sprint ID")
        .optional(),

      status: z.enum(["ToDo", "InProgress", "Standby", "Done"]).optional(),
    })
    .optional(),
});

export {
  createTaskSchema,
  updateTaskSchema,
  taskIdParamSchema,
  listTasksQuerySchema,
};
