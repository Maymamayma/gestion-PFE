const { z } = require("zod");

// Schéma de validation pour le changement de statut
const updateTaskStatusSchema = z.object({
  body: z.object({
    status: z.enum(["ToDo", "InProgress", "Standby", "Done"], {
      required_error: "Le statut est requis",
      invalid_type_error: "Le statut doit être : ToDo, InProgress, Standby ou Done"
    }),

    notes: z
      .string()
      .max(500, "Les notes ne peuvent pas dépasser 500 caractères")
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
  updateTaskStatusSchema
};