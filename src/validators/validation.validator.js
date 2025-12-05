import { z } from "zod";

// Schéma de validation pour valider une tâche
const validateTaskSchema = z.object({
  body: z.object({
    estValide: z.boolean({
      required_error: "Le champ estValide est requis",
      invalid_type_error: "estValide doit être un booléen (true/false)",
    }),

    commentaire: z
      .string()
      .max(1000, "Le commentaire ne peut pas dépasser 1000 caractères")
      .trim()
      .optional(),

    reunionId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "ID de réunion invalide")
      .optional()
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

// Schema for reunion ID param
const reunionIdParamSchema = z.object({
  params: z.object({
    reunionId: z
      .string({
        required_error: "L'ID de la réunion est requis",
      })
      .regex(/^[0-9a-fA-F]{24}$/, "ID de réunion invalide"),
  }),
});

export { validateTaskSchema, reunionIdParamSchema };
