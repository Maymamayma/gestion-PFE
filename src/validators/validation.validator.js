import { z } from "zod";

// Schéma de validation pour valider une tâche
const validateTaskSchema = z.object({
  body: z.object({
    isValid: z.boolean({
      required_error: "Le champ isValid est requis",
      invalid_type_error: "isValid doit être un booléen (true/false)",
    }),

    comment: z
      .string()
      .max(1000, "Le commentaire ne peut pas dépasser 1000 caractères")
      .trim()
      .optional(),

    meetingId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "ID de réunion invalide")
      .optional()
      .or(z.literal(""))
      .nullable(),
  }),

  params: z.object({
    taskId: z
      .string({
        required_error: "L'ID de la tâche est requis",
      })
      .regex(/^[0-9a-fA-F]{24}$/, "ID de tâche invalide"),
  }),
});

// Schema for reunion ID param (using meetingId to match route)
const reunionIdParamSchema = z.object({
  params: z.object({
    meetingId: z
      .string({
        required_error: "L'ID de la réunion est requis",
      })
      .regex(/^[0-9a-fA-F]{24}$/, "ID de réunion invalide"),
  }),
});

export { reunionIdParamSchema, validateTaskSchema };

