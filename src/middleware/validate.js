import { ZodError } from "zod";

/**
 * Middleware de validation Zod
 * @param {ZodSchema} schema - Schéma Zod à valider
 */
export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      // console.log("🔍 Validation Input:", {
      //   body: req.body,
      //   params: req.params,
      //   query: req.query,
      // });

      // Valider la requête (body, params, query)
      await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      // console.log("✅ Validation passed");
      next();
    } catch (error) {
      console.error("❌ Validation failed:", error);

      if (error instanceof ZodError) {
        // Formater les erreurs Zod
        const errors = error.errors?.map((err) => ({
          field: err.path.join("."),
          message: err.message,
          value: err.received,
          code: err.code,
        })) || [];

        console.error("📋 Validation errors:", JSON.stringify(errors, null, 2));

        return res.status(400).json({
          error: "Validation échouée",
          details: errors,
          raw: error.errors,
        });
      }

      // Autres erreurs
      console.error("💥 Non-Zod error:", error);
      return res.status(500).json({
        error: "Erreur de validation",
        message: error?.message || "Erreur inconnue",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  };
};
