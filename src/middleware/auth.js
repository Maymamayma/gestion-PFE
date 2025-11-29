import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";

export const loggedMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log("token: ", token);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    try {
      const user = await User.findOne({ _id: userId });
      if (user) {
        req.auth = {
          userId: userId,
          role: user.role,
        };
        next();
      } else {
        res.status(401).json({ error: "user doesn't exist" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export const isStudent = (req, res, next) => {
  try {
    if (req.auth.role === "etudiant") {
      next();
    } else {
      res.status(403).json({ error: "forbidden" });
    }
  } catch (e) {
    res.status(401).json({ e: e.message });
  }
};

export const isCompanySupervisor = (req, res, next) => {
  try {
    if (req.auth.role === "encad_entreprise") {
      next();
    } else {
      res.status(403).json({ error: "forbidden" });
    }
  } catch (e) {
    res.status(401).json({ e: e.message });
  }
};

export const isUniversitySupervisor = (req, res, next) => {
  try {
    if (req.auth.role === "encad_universitaire") {
      next();
    } else {
      res.status(403).json({ error: "forbidden" });
    }
  } catch (e) {
    res.status(401).json({ e: e.message });
  }
};