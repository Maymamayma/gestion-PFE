import { z } from "zod";

// Schema for creating a meeting
const createMeetingSchema = z.object({
  body: z.object({
    projectId: z
      .string({
        required_error: "L'ID du projet est requis",
      })
      .regex(/^[0-9a-fA-F]{24}$/, "ID de projet invalide"),

    datePlanification: z
      .string({
        required_error: "La date de la réunion est requise",
      })
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Format de date invalide",
      })
      .refine(
        (date) => new Date(date) > new Date(),
        "La date de la réunion doit être dans le futur"
      ),

    ordreDuJour: z
      .string({
        required_error: "L'ordre du jour est requis",
      })
      .min(10, "L'ordre du jour doit contenir au moins 10 caractères")
      .max(2000, "L'ordre du jour ne peut pas dépasser 2000 caractères")
      .trim(),

    referenceType: z
      .enum(["UserStory", "Task", "Report"])
      .optional()
      .nullable(),

    referenceId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "ID de référence invalide")
      .optional()
      .nullable(),
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
      .min(10, "L'ordre du jour doit contenir au moins 10 caractères")
      .max(2000, "L'ordre du jour ne peut pas dépasser 2000 caractères")
      .trim()
      .optional(),

    referenceType: z
      .enum(["UserStory", "Task", "Report"])
      .optional()
      .nullable(),

    referenceId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "ID de référence invalide")
      .optional()
      .nullable(),
  }),

  params: z.object({
    id: z
      .string({
        required_error: "L'ID de la réunion est requis",
      })
      .regex(/^[0-9a-fA-F]{24}$/, "ID de réunion invalide"),
  }),
});

// Schema for completing a meeting
const completeMeetingSchema = z.object({
  body: z.object({
    compteRendu: z
      .string({
        required_error: "Le compte rendu est requis",
      })
      .min(20, "Le compte rendu doit contenir au moins 20 caractères")
      .max(5000, "Le compte rendu ne peut pas dépasser 5000 caractères")
      .trim(),
  }),

  params: z.object({
    id: z
      .string({
        required_error: "L'ID de la réunion est requis",
      })
      .regex(/^[0-9a-fA-F]{24}$/, "ID de réunion invalide"),
  }),
});

// Schema for validating meeting content
const validateMeetingContentSchema = z.object({
  body: z.object({
    estValide: z.boolean({
      required_error: "Le statut de validation est requis",
      invalid_type_error: "estValide doit être un booléen (true/false)",
    }),

    commentaire: z
      .string()
      .max(1000, "Le commentaire ne peut pas dépasser 1000 caractères")
      .trim()
      .optional(),
  }),

  params: z.object({
    id: z
      .string({
        required_error: "L'ID de la réunion est requis",
      })
      .regex(/^[0-9a-fA-F]{24}$/, "ID de réunion invalide"),
  }),
});

// Schema for meeting ID param
const meetingIdParamSchema = z.object({
  params: z.object({
    id: z
      .string({
        required_error: "L'ID de la réunion est requis",
      })
      .regex(/^[0-9a-fA-F]{24}$/, "ID de réunion invalide"),
  }),
});

// Schema for project ID query
const projectIdQuerySchema = z.object({
  query: z.object({
    projectId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "ID de projet invalide")
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
