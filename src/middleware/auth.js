import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";

// Middleware to check token and set req.auth
export const loggedMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Token missing" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token missing" });

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.userId);
    if (!user) return res.status(401).json({ error: "User not found" });

    req.auth = { userId: user._id, role: user.role.toLowerCase() };
    next();
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

// Middleware to check if user is a student
export const isStudent = (req, res, next) => {
  if (!req.auth) return res.status(401).json({ error: "Not authenticated" });

  if (req.auth.role === "etudiant") {
    next();
  } else {
    res.status(403).json({ error: "Forbidden" });
  }
};

// Middleware to check if user is a company supervisor
export const isCompanySupervisor = (req, res, next) => {
  if (!req.auth) return res.status(401).json({ error: "Not authenticated" });

  if (req.auth.role === "encad_entreprise") {
    next();
  } else {
    res.status(403).json({ error: "Forbidden" });
  }
};

// Middleware to check if user is a university supervisor
export const isUniversitySupervisor = (req, res, next) => {
  if (!req.auth) return res.status(401).json({ error: "Not authenticated" });

  if (req.auth.role === "encad_universitaire") {
    next();
  } else {
    res.status(403).json({ error: "Forbidden" });
  }
};
