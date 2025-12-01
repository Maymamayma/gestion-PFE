const { z } = require("zod");

// Schéma de validation pour la création d'une tâche
const createTaskSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: "Le titre est requis",
        invalid_type_error: "Le titre doit être une chaîne de caractères"
      })
      .min(3, "Le titre doit contenir au moins 3 caractères")
      .max(255, "Le titre ne peut pas dépasser 255 caractères")
      .trim(),

    description: z
      .string({
        required_error: "La description est requise",
        invalid_type_error: "La description doit être une chaîne de caractères"
      })
      .min(10, "La description doit contenir au moins 10 caractères")
      .trim(),

    priority: z.enum(["Basse", "Moyenne", "Haute"], {
      required_error: "La priorité est requise",
      invalid_type_error: "La priorité doit être : Basse, Moyenne ou Haute"
    })
  }),

  params: z.object({
    projectId: z
      .string({
        required_error: "L'ID du projet est requis"
      })
      .regex(/^[0-9a-fA-F]{24}$/, "ID de projet invalide"),

    sprintId: z
      .string({
        required_error: "L'ID du sprint est requis"
      })
      .regex(/^[0-9a-fA-F]{24}$/, "ID de sprint invalide"),

    userStoryId: z
      .string({
        required_error: "L'ID de la user story est requis"
      })
      .regex(/^[0-9a-fA-F]{24}$/, "ID de user story invalide")
  })
});

// Schéma de validation pour la mise à jour d'une tâche
const updateTaskSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(3, "Le titre doit contenir au moins 3 caractères")
      .max(255, "Le titre ne peut pas dépasser 255 caractères")
      .trim()
      .optional(),

    description: z
      .string()
      .min(10, "La description doit contenir au moins 10 caractères")
      .trim()
      .optional(),

    priority: z
      .enum(["Basse", "Moyenne", "Haute"])
      .optional()
  }).refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "Au moins un champ doit être fourni pour la mise à jour"
    }
  ),

  params: z.object({
    taskId: z
      .string({
        required_error: "L'ID de la tâche est requis"
      })
      .regex(/^[0-9a-fA-F]{24}$/, "ID de tâche invalide")
  })
});

// Schéma pour les paramètres ID
const taskIdParamSchema = z.object({
  params: z.object({
    taskId: z
      .string({
        required_error: "L'ID de la tâche est requis"
      })
      .regex(/^[0-9a-fA-F]{24}$/, "ID de tâche invalide")
  })
});

// Schéma pour les query params de liste
const listTasksQuerySchema = z.object({
  params: z.object({
    projectId: z
      .string({
        required_error: "L'ID du projet est requis"
      })
      .regex(/^[0-9a-fA-F]{24}$/, "ID de projet invalide")
  }),

  query: z.object({
    sprintId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "ID de sprint invalide")
      .optional(),

    status: z
      .enum(["ToDo", "InProgress", "Standby", "Done"])
      .optional()
  }).optional()
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  taskIdParamSchema,
  listTasksQuerySchema
};