const { z } = require("zod");

// Schéma de validation pour valider une tâche
const validateTaskSchema = z.object({
  body: z.object({
    isValid: z.boolean({
      required_error: "Le champ isValid est requis",
      invalid_type_error: "isValid doit être un booléen (true/false)"
    }),

    comment: z
      .string()
      .max(1000, "Le commentaire ne peut pas dépasser 1000 caractères")
      .trim()
      .optional()
  }),

  params: z.object({
    taskId: z
      .string({
        required_error: "L'ID de la tâche est requis"
      })
      .regex(/^[0-9a-fA-F]{24}$/, "ID de tâche invalide")
  })
});

module.exports = {
  validateTaskSchema
};