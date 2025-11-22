// src/middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // optionnel si tu veux charger l'utilisateur depuis la DB

const authMiddleware = {};

/**
 * Vérifie la présence et la validité du token Bearer.
 * Ajoute req.user = { id, role, email? } si le token est valide.
 */
authMiddleware.authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // payload devrait contenir l'id et le role (ex: { id, role, email })
    req.user = {
      id: payload.id,
      role: payload.role,
      email: payload.email,
    };
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
};

/**
 * Vérifie que l'utilisateur a l'un des rôles autorisés.
 * Usage : authorize('ETUDIANT') ou authorize('ETUDIANT','ADMIN')
 */
authMiddleware.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // si pas d'utilisateur authentifié
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    // rôle autorisé ?
    if (!allowedRoles.length) return next(); // pas de restriction
    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Accès refusé : rôle insuffisant" });
    }

    return next();
  };
};

module.exports = authMiddleware;
