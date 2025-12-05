import { ZodError } from "zod";

/**
 * Middleware de validation Zod
 * @param {ZodSchema} schema - Schéma Zod à valider
 */
export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      // Valider la requête (body, params, query)
      await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Formater les erreurs Zod
        const errors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return res.status(400).json({
          error: "Validation échouée",
          details: errors,
        });
      }

      // Autres erreurs
      return res.status(500).json({
        error: "Erreur de validation",
        message: error.message,
      });
    }
  };
};
export const validateRequest = (schemas) => {
  return async (req, res, next) => {
    try {
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return res.status(400).json({
          error: "Validation échouée",
          details: errors,
        });
      }
      return res.status(500).json({
        error: "Erreur interne de validation",
        message: error.message,
      });
    }
  };
};