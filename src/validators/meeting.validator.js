import { z } from "zod";

const meetingUrlSchema = z
  .union([
    z.string().trim().url("Invalid meeting URL").max(2048, "Meeting URL cannot exceed 2048 characters"),
    z.literal(""),
    z.null(),
  ])
  .optional();

// Schema for creating a meeting
const createMeetingSchema = z.object({
  body: z.object({
    projectId: z
      .string({
        required_error: "Project ID is required",
      })
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid project ID"),

    datePlanification: z
      .string({
        required_error: "Meeting date is required",
      })
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
      })
      .refine(
        (date) => new Date(date) > new Date(),
        "Please select a meeting date that has not already passed. "
      ),

    ordreDuJour: z
      .string({
        required_error: "Agenda is required",
      })
      .min(10, "Agenda must contain at least 10 characters")
      .max(2000, "Agenda cannot exceed 2000 characters")
      .trim(),

    meeting_URL: meetingUrlSchema,

    referenceType: z
      .enum(["UserStory", "Task", "Report"])
      .optional()
      .nullable(),

    referenceId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid reference ID")
      .optional()
      .nullable(),
  }).superRefine((data, ctx) => {
    const hasReferenceType = Boolean(data.referenceType);
    const hasReferenceId = Boolean(data.referenceId);

    if (hasReferenceType !== hasReferenceId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "referenceType and referenceId must be provided together",
        path: hasReferenceType ? ["referenceId"] : ["referenceType"],
      });
    }
  }),
});

// Schema for updating a meeting
const updateMeetingSchema = z.object({
  body: z.object({
    datePlanification: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Format de date invalide",
      })
      .optional(),

    ordreDuJour: z
      .string()
      .min(10, "Agenda must contain at least 10 characters")
      .max(2000, "Agenda cannot exceed 2000 characters")
      .trim()
      .optional(),

    meeting_URL: meetingUrlSchema,

    referenceType: z
      .enum(["UserStory", "Task", "Report"])
      .optional()
      .nullable(),

    referenceId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid reference ID")
      .optional()
      .nullable(),
  }).superRefine((data, ctx) => {
    const hasReferenceType = Boolean(data.referenceType);
    const hasReferenceId = Boolean(data.referenceId);

    if (hasReferenceType !== hasReferenceId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "referenceType and referenceId must be provided together",
        path: hasReferenceType ? ["referenceId"] : ["referenceType"],
      });
    }
  }),

  params: z.object({
    id: z
      .string({
        required_error: "Meeting ID is required",
      })
      .regex(/^[0-9a-fA-F]{24}$/, "Meeting ID is Invalid"),
  }),
});

// Schema for completing a meeting
const completeMeetingSchema = z.object({
  body: z.object({
    compteRendu: z
      .string({
        required_error: "Meeting report is required",
      })
      .min(20, "Meeting report must contain at least 20 characters")
      .max(5000, "Meeting report cannot exceed 5000 characters")
      .trim(),
  }),

  params: z.object({
    id: z
      .string({
        required_error: "Meeting report is required",
      })
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid meeting ID"),
  }),
});

// Schema for validating meeting content
const validateMeetingContentSchema = z.object({
  body: z.object({
    estValide: z.boolean({
      required_error: "Validation status is required",
      invalid_type_error: "estValide must be a boolean (true/false)",
    }),

    commentaire: z
      .string()
      .max(1000, "Comment cannot exceed 1000 characters")
      .trim()
      .optional(),
  }),

  params: z.object({
    id: z
      .string({
        required_error: "Meeting ID is required",
      })
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid meeting ID"),
  }),
});

// Schema for meeting ID param
const meetingIdParamSchema = z.object({
  params: z.object({
    id: z
      .string({
        required_error: "Meeting ID is required",
      })
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid meeting ID"),
  }),
});

// Schema for project ID query
const projectIdQuerySchema = z.object({
  query: z.object({
    projectId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid project ID")
      .optional(),
  }),
});

export {
  createMeetingSchema,
  updateMeetingSchema,
  completeMeetingSchema,
  validateMeetingContentSchema,
  meetingIdParamSchema,
  projectIdQuerySchema,
};
